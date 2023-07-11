//  controllers/booksController.js
"use strict";


const Book = require("../models/Book"); // 책 모델 요청 

module.exports = {
    index: (req, res, next) => {
        Book.find()
            .then((books) => {
                // 책들 배열로 index 페이지 렌더링 
                res.locals.books = books;
                next();
            })
            .catch((error) => {
                // 로그 메시지 출력하고 홈페이지로 리다이렉트 
                console.log(`Error fetching books: ${error.message}`);
                next(error); // 에러를 캐치하고 다음 미들웨어로 전달
            });
    },
    indexView: (req, res) => {
        res.render("books/index", {
            page: "books",
            title: "All Books",
        });
    },

    new: (req, res) => {
        res.render("books/new", {
            page: "new-book",
            title: "New Book",
        });
    },

    // 사용자를 데이터베이스에 저장하기 위한 create 액션 추가
    create: (req, res, next) => {
        let gameParams = {
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            one_words: req.body.one_words,
            image: req.body.image
        };
        // 폼 파라미터로 사용자 생성
        Book.create(gameParams)
            .then((book) => {
                res.locals.redirect = "/books";
                res.locals.books = book;
                next();
            })
            .catch((error) => {
                console.log(`Error saving book: ${error.message}`);
                next(error);
            });
    },

    // 분리된 redirectView 액션에서 뷰 렌더링
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },



    /**
     * Listing 19.7 (p. 285)
     * gamesController.js에서 특정 게임에 대한 show 액션 추가
     */
    show: (req, res, next) => {
        let bookID = req.params.id; // request params로부터 사용자 ID 수집
        Book.findById(bookID) // ID로 게임 찾기
            .then((book) => {
                res.locals.book = book; // 응답 객체를 통해 다음 믿들웨어 함수로 사용자 전달
                next();
            })
            .catch((error) => {
                console.log(`Error fetching book by ID: ${error.message}`);
                next(error); // 에러를 로깅하고 다음 함수로 전달
            });
    },

    // show 뷰의 렌더링
    showView: (req, res) => {
        res.render("books/show", {
            page: "book-details",
            title: "Book Details",
        });
    },

    /**
     * Listing 20.6 (p. 294)
     * edit와 update 액션 추가
     */
    // edit 액션 추가
    edit: (req, res, next) => {
        let bookID = req.params.id;
        Book.findById(bookID) // ID로 데이터베이스에서 사용자를 찾기 위한 findById 사용
            .then((book) => {
                res.render("books/edit", {
                    book: book,
                    page: "edit-book",
                    title: "Edit Book",
                }); // 데이터베이스에서 내 특정 사용자를 위한 편집 페이지 렌더링
            })
            .catch((error) => {
                console.log(`Error fetching book by ID: ${error.message}`);
                next(error);
            });
    },

    // update 액션 추가
    update: (req, res, next) => {
        let bookId = req.params.id,
            bookParams = {
                title: req.body.title,
                author: req.body.author,
                genre: req.body.genre,
                one_words: req.body.one_words,
                image: req.body.image
            }; // 요청으로부터 사용자 파라미터 취득
        console.log(bookParams);
        Book.findByIdAndUpdate(bookId, {
            $set: bookParams,
        }) //ID로 사용자를 찾아 단일 명령으로 레코드를 수정하기 위한 findByIdAndUpdate의 사용
            .then((book) => {
                res.locals.redirect = `/books/${bookId}`;
                res.locals.book = book;
                next(); // 지역 변수로서 응답하기 위해 사용자를 추가하고 다음 미들웨어 함수 호출
            })
            .catch((error) => {
                console.log(`Error updating book by ID: ${error.message}`);
                next(error);
            });
    },

    /**
     * Listing 20.9 (p. 298)
     * delete 액션의 추가
     */
    delete: (req, res, next) => {
        let bookId = req.params.id;
        Book.findByIdAndRemove(bookId) // findByIdAndRemove 메소드를 이용한 사용자 삭제
            .then(() => {
                res.locals.redirect = "/books";
                next();
            })
            .catch((error) => {
                console.log(`Error deleting book by ID: ${error.message}`);
                next();
            });
    },
}
