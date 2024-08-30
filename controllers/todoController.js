const { createRandomString } = require('../modules/generateCode');
const { getConnection } = require('../modules/connectMysql');

const saveTodoList = async (req, res) => {
  const receivedData = JSON.stringify(req.body);
  const randomcode = createRandomString(6);
  const connection = await getConnection();

  try {
    if (!connection) throw new Error('SQL Connection Error');
    const sql = 'INSERT INTO todolist (code, todos, saveDate) VALUES (?, ?, NOW())';
    await connection.query(sql, [randomcode, receivedData]);

    if (receivedData.length === 0) throw new Error('No Data');
    console.log('Data Saved:', randomcode);
    return res.status(201).json({ code: randomcode });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    if (connection) connection.release();
  }
};

const loadTodoList = async (req, res) => {
  const receivedCode = req.params.code;
  const connection = await getConnection();

  try {
    if (!connection) throw new Error('SQL Connection Error');
    const sql = 'SELECT todos FROM todolist WHERE code = ?';
    const [rows] = await connection.query(sql, [receivedCode]);

    if (rows.length === 0) {
      console.warn('Code Not Found');
      return res.status(404).send('Code Not Found');
    } else {
      console.log('Data loaded:', receivedCode);
      return res.status(200).json({'todos' : rows[0].todos});
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { saveTodoList, loadTodoList };