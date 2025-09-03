exports.health = (req, res) => {
  res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() } });
};
