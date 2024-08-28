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

// 로그인
const checkUser = async (req, res) => {
  try {
    const { inputid, inputpw } = req.body;
    const dbResult = await queryDB('SELECT id, pw FROM userdata WHERE id = ?', [inputid]);

    // 아이디가 없을 경우
    if (dbResult.length === 0) {
      console.warn('ID Does Not Exist:', inputid);
      return res.status(404).json({ message: 'ID Does Not Exist' });
    }

    // 비밀번호가 일치하지 않을 경우
    if (inputpw !== dbResult[0].pw) {
      console.warn('Wrong Password:', inputid);
      return res.status(401).json({ message: 'Wrong Password' });
    }

    // 로그인 성공 시
    req.session.user = {
      id: inputid,
      loggedIn: true
    };
    console.log('Login Success:', inputid);
    return res.status(200).json({ message: 'Login Success' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login Failed' });
  }
};

// 로그아웃
const logoutUser = async (req, res) => {
  const loginid = req.session.user.id
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout Failed:', loginid);
        return res.status(500).json({ message: 'Logout Failed' });
      }
      else {
        console.log('Logout Success:', loginid);
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logout Success' });
      }
    });
  } else {
    console.warn('User Does Not Login');
    res.status(400).json({ message: 'User Does Not Login' });
  }
}

module.exports = { checkUser, logoutUser };
