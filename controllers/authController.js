const { mySQL } = require('../modules/connectDB');
const { verifyHash } = require('../modules/hashPassword');
const token = require('../modules/token');

// 로그인
const loginUser = async (req, res) => {
  try {
    const { inputid, inputpw } = req.body;
    const [dbResult] = await mySQL('SELECT id, pw, salt FROM userdata WHERE id = ?', [inputid]);

    // 아이디가 없을 경우
    if (!dbResult) {
      console.warn('ID Does Not Exist:', inputid);
      return res.status(404).json({ message: 'ID Does Not Exist' });
    }

    // 비밀번호가 일치하지 않을 경우
    const rehashedPassword = verifyHash(dbResult.salt, inputpw);
    if (rehashedPassword !== dbResult.pw) {
      console.warn('Wrong Password:', dbResult.id);
      return res.status(401).json({ message: 'Wrong Password' });
    }

    // 로그인 성공 시
    const refreshToken = token.generateRefresh(dbResult.id);
    const accessToken = token.generateAccess(dbResult.id);

    await mySQL('INSERT INTO token (id, refreshtoken, genDate) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE refreshtoken = ?', [dbResult.id, refreshToken, refreshToken])
    res.cookie('token', accessToken, { httpOnly: true, secure: true });
    console.log('Login Success:', dbResult.id);
    return res.status(200).json({ message: 'Login Success' });
  } catch (error) {
    console.error('[checkUser]', error);
    return res.status(500).json({ message: 'Login Failed' });
  }
};

// 로그아웃
const logoutUser = async (req, res) => {
  try {
    const id = token.decodeAccess(req.cookies.token).id;
    await mySQL('DELETE FROM token WHERE id = ?', [id]);
    res.cookie('token', '', { maxAge: 0, path: '/' });
    console.log('Logout Success:', id)
    return res.status(200).json({ message: 'Logout Success' });
  } catch (error) {
    console.error('[logoutUser]', error);
    return res.status(500).json({ message: 'Logout Failed' });
  }
};

// 토큰 재발급
const refreshAccessToken = async (req, res) => {
  try {
    const accessToken = req.cookies.token;
    const decodeAccess = token.decodeAccess(accessToken);
    const [dbResult] = await mySQL('SELECT refreshtoken FROM token WHERE id = ?', [decodeAccess.id]);

    if (!dbResult) {
      console.warn('RefreshToken Does Not Exist:', decodeAccess.id);
      return res.status(404).json({ message: 'RefreshToken Does Not Exist' });
    }

    const refreshToken = dbResult.refreshtoken;

    if (token.compare(accessToken, refreshToken)) {
      const newAccessToken = token.generateAccess(decodeAccess.id);
      res.cookie('token', newAccessToken, { httpOnly: true, secure: false, path: '/' });
      console.log('AccessToken Refreshed:', decodeAccess.id);
      return res.status(200).json({ message: 'AccessToken Refreshed' });
    } else {
      console.warn('Token Does Not Match:', decodeAccess.id);
      return res.status(401).json({ message: 'Token Does Not Match' });
    }
  } catch (error) {
    console.error('[refreshAccessToken]', error);
    return res.status(500).json({ message: 'Refresh AccessToken Failed' });
  }
}

module.exports = { loginUser, logoutUser, refreshAccessToken };
