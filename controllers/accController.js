const { mySQL } = require('../modules/connectDB');
const { hashPassword } = require('../modules/hashPassword');

// 중복 아이디 체크
const checkDuplicate = async (req, res) => {
  try {
    const [dbResult] = await mySQL('SELECT id FROM userdata WHERE id = ?', [req.query.id]);
    if (dbResult) {
      console.warn('Duplicate ID:', dbResult.id);
      return res.status(409).json({ message: 'Duplicate ID' });
    }

    return res.status(200).json({ message: 'Not duplicate' });
  } catch (error) {
    console.error('[loadTodoList]', error);
    return res.status(500).json({ message: 'checkDuplicate Failed' });
  }
};

// 계정 생성
const createAccount = async (req, res) => {
  try {
    const { inputid, inputpw } = req.body;
    const { salt, hashedPassword } = hashPassword(inputpw);

    await mySQL('INSERT INTO userdata (id, pw, salt, regDate) VALUES (?, ?, ?, NOW())', [inputid, hashedPassword, salt]);
    console.log('Register Success:', inputid);
    return res.status(201).json({ message: 'Register Success' });
  } catch (error) {
    console.error('[createAccount]', error);
    return res.status(500).json({ message: 'Register Failed' });
  }
};

module.exports = { checkDuplicate, createAccount };
