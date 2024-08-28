const { getConnection } = require('../models/db');

// 공통 SQL 실행 함수
const queryDB = async (sql, params) => {
  const connection = await getConnection();
  if (!connection) throw new Error('SQL Connection Error');
  try {
    const [dbResult] = await connection.query(sql, params);
    return dbResult;
  } finally {
    if (connection) connection.release();
  }
};

// 중복 아이디 체크
const checkDuplicate = async (req, res) => {
  try {
    const dbResult = await queryDB('SELECT id FROM userdata WHERE id = ?', [req.query.id]);
    if (dbResult.length > 0) {
      console.warn('Duplicate ID:', dbResult[0].id);
      return res.status(409).json({ message: 'Duplicate ID' });
    }
    return res.status(200).json({ message: 'Not duplicate' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'CheckDuplicate Failed' });
  }
};

// 계정 생성
const createAccount = async (req, res) => {
  try {
    const { inputid, inputpw } = req.body;
    const dbResult = await queryDB('SELECT id FROM userdata WHERE id = ?', [inputid]);

    if (dbResult.length > 0) {
      console.warn('Duplicate ID:', inputid);
      return res.status(409).json({ message: 'Duplicate ID' });
    }

    await queryDB('INSERT INTO userdata (id, pw, regDate) VALUES (?, ?, NOW())', [inputid, inputpw]);
    console.log('Register Success:', inputid);
    return res.status(201).json({ message: 'Register Success' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Register Failed' });
  }
};

module.exports = { checkDuplicate, createAccount };
