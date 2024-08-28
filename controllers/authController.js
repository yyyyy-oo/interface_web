const { getConnection } = require('../models/db');

const checkDuplicate = async (req, res) => {
  const inputid = req.query.id;
  const connection = await getConnection();
  try {
    if (!connection) throw new Error('SQL Connection Error');

    let sql = 'SELECT id FROM userdata WHERE id = ?';
    const [rows] = await connection.query(sql, [inputid]);

    if (rows.length > 0 && rows[0].id === inputid) {
      console.warn('Duplicate ID');
      return res.status(409).json({ message: 'Duplicate ID' })
    } else {
      return res.status(200).json({ message: 'Not duplicate' });
    }
  } catch (error) {
    console.error('Check Duplicate Failed:', error);
    return res.status(500).json({ message: 'Check Duplicate Failed' });
  } finally {
    if (connection) connection.release();
  }
}

const createAccount = async (req, res) => {
  const { inputid, inputpw } = req.body;
  const connection = await getConnection();

  try {
    if (!connection) throw new Error('SQL Connection Error');

    let sql = 'SELECT id FROM userdata WHERE id = ?';
    const [rows] = await connection.query(sql, [inputid]);

    if (rows.length > 0 && rows[0].id === inputid) {
      console.warn('Duplicate ID');
      return res.status(409).json({ message: 'Duplicate ID' });
    }

    sql = 'INSERT INTO userdata (id, pw, regDate) VALUES (?, ?, NOW())';
    await connection.query(sql, [inputid, inputpw]);

    console.log('Register Success');
    return res.status(200).json({ message: 'Register Success' });
  } catch (error) {
    console.error('Register Failed:', error);
    return res.status(500).json({ message: 'Register Failed' });
  } finally {
    if (connection) connection.release();
  }
};


const checkUser = (req, res) => {
  // Implement login logic here
};

module.exports = { checkDuplicate, createAccount, checkUser };
