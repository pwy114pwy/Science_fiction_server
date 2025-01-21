const express = require('express');
const cors = require('cors');
const path = require('path'); // 导入 path 模块
const swiperRouter = require('./routes/swiper');
const recommendRouter = require('./routes/getAllBooks');
const getBookDetail = require('./routes/getBookDetail');
const searchBook = require('./routes/searchBook');
const getUser = require('./routes/getUser');
const collectBook = require('./routes/collectBook');
const browseHistory = require('./routes/browseHistory');
const submitComment = require('./routes/submitComment.js');
const Illustrated = require('./routes/get_Illustrated.js');
const getCharactersAndRelationships = require('./routes/getCharactersAndRelationships.js');
const getCharactersDetail = require('./routes/getCharactersDetail.js');
const getRelatedCharacters = require('./routes/getRelatedCharacters.js');
const getEvent = require('./routes/getEvent.js');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(swiperRouter);
app.use(getBookDetail);
app.use(recommendRouter);
app.use(searchBook);
app.use(getUser);
app.use(collectBook);
app.use(collectBook);
app.use(browseHistory);
app.use(submitComment);
app.use(Illustrated);
app.use(getCharactersAndRelationships);
app.use(getCharactersDetail);
app.use(getRelatedCharacters);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});