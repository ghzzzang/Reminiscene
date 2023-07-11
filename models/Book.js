
// models/Book.js
"use strict";

const mongoose = require("mongoose"),
    bookSchema = mongoose.Schema(
        {
            // 책 스키마에 속성 추가
            title: {
                type: String,
                required: true,
            },
            author: {
                type: String,
                required: true,
            },
            genre: {
                type: String,
                required: true,
            },

            one_words: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true,
            }

        },
        {
            timestamps: true,
        }
    );

module.exports = mongoose.model("Book", bookSchema);