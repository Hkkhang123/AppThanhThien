import pool from '../config/db.js';
import ExcelJS from 'exceljs';

export async function getDashboardStats(req, res) {
  try {
    // Tổng số vé đã bán
    const ticketCountResult = await pool.query('SELECT COUNT(*) FROM tickets');
    const ticketCount = parseInt(ticketCountResult.rows[0].count, 10);

    // Tổng doanh thu (giả sử price lưu ở trips, mỗi vé có trip_id)
    const revenueResult = await pool.query('SELECT COALESCE(SUM(trips.price),0) AS total FROM tickets JOIN trips ON tickets.trip_id = trips.id');
    const totalRevenue = parseFloat(revenueResult.rows[0].total);

    // Số lượng đơn hàng gửi giao
    const goodsCountResult = await pool.query('SELECT COUNT(*) FROM goods');
    const goodsCount = parseInt(goodsCountResult.rows[0].count, 10);

    // Tuyến xe nổi bật (nhiều vé nhất)
    const topRouteResult = await pool.query(`
      SELECT routes.id, routes.departure, routes.destination, COUNT(*) AS ticket_count
      FROM tickets
      JOIN trips ON tickets.trip_id = trips.id
      JOIN routes ON trips.route_id = routes.id
      GROUP BY routes.id, routes.departure, routes.destination
      ORDER BY ticket_count DESC
      LIMIT 1
    `);
    const topRoute = topRouteResult.rows[0] || null;

    res.json({
      ticketCount,
      totalRevenue,
      goodsCount,
      topRoute
    });
  } catch (err) {
    res.status(500).json({ message: 'Lấy số liệu dashboard thất bại', error: err.message });
  }
}

export async function exportReportExcel(req, res) {
  try {
    // Lấy tham số lọc
    const { date_from, date_to, route_id } = req.query;
    // Truy vấn tổng hợp doanh thu, số lượng khách theo tuyến và thời gian
    let query = `SELECT routes.id as route_id, routes.departure, routes.destination, DATE(trips.departure_time) as date,
      COUNT(tickets.id) as ticket_count, COALESCE(SUM(trips.price),0) as total_revenue
      FROM tickets
      JOIN trips ON tickets.trip_id = trips.id
      JOIN routes ON trips.route_id = routes.id
      WHERE 1=1`;
    const params = [];
    let idx = 1;
    if (route_id) {
      query += ` AND routes.id = $${idx++}`;
      params.push(route_id);
    }
    if (date_from) {
      query += ` AND DATE(trips.departure_time) >= $${idx++}`;
      params.push(date_from);
    }
    if (date_to) {
      query += ` AND DATE(trips.departure_time) <= $${idx++}`;
      params.push(date_to);
    }
    query += ` GROUP BY routes.id, routes.departure, routes.destination, DATE(trips.departure_time)
      ORDER BY DATE(trips.departure_time) DESC, routes.id`;
    const result = await pool.query(query, params);
    // Tạo workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Báo cáo doanh thu');
    worksheet.columns = [
      { header: 'Tuyến xe', key: 'route', width: 30 },
      { header: 'Ngày', key: 'date', width: 15 },
      { header: 'Số vé bán', key: 'ticket_count', width: 12 },
      { header: 'Doanh thu (VNĐ)', key: 'total_revenue', width: 18 },
    ];
    result.rows.forEach(row => {
      worksheet.addRow({
        route: `${row.departure} - ${row.destination}`,
        date: row.date ? new Date(row.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '',
        ticket_count: row.ticket_count,
        total_revenue: row.total_revenue
      });
    });
    // Thiết lập header trả file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=bao_cao_doanh_thu.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Xuất báo cáo thất bại', error: err.message });
  }
} 