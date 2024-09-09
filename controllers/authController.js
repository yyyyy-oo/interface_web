const { mySQL } = require('../modules/connectMysql');
const { verifyHash } = require('../modules/hashPassword');
const { generateAccessToken } = require('../modules/tokenControl');

// 로그인
const checkUser = async (req, res) => {
  try {
    const { inputid, inputpw } = req.body;
    const dbResult = await mySQL('SELECT id, pw, salt FROM userdata WHERE id = ?', [inputid]);

    // 아이디가 없을 경우
    if (dbResult.length === 0) {
      console.warn('ID Does Not Exist:', inputid);
      return res.status(404).json({ message: 'ID Does Not Exist' });
    }

    // 비밀번호가 일치하지 않을 경우
    const rehashedPassword = verifyHash(dbResult[0].salt, inputpw);
    if (rehashedPassword !== dbResult[0].pw) {
      console.warn('Wrong Password:', inputid);
      return res.status(401).json({ message: 'Wrong Password' });
    }

    // 로그인 성공 시
    const accessToken = generateAccessToken(inputid);
    res.cookie('token', accessToken, { httpOnly: true, secure: true });
    return res.status(200).json({ message: 'Login Success' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login Failed' });
  }
};

// 로그아웃
const logoutUser = async (req, res) => {
  res.cookie('token', '', { maxAge: 0 });
  return res.status(200).json({ message: 'Logout Success' });
}

module.exports = { checkUser, logoutUser };
