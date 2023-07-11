// models/Course.js
"use strict";

/**
 * Listing 17.6 (p. 249)
 * 새로운 스키마와 모델의 생성
 */
const mongoose = require("mongoose"),
  gameSchema = mongoose.Schema(
    {
      // 게임 스키마에 속성 추가
      title: {
        type: String,
        required: true,
        unique: true,
      },
      producer: {
        type: String,
        required: true,
      },
      genre: {
        type: String,
        required: true,
      },
      cost: {
        type: Number,
        default: 0,
        min: [0, "Game cannot have a negative cost"],
      },
      image: {
        type: String,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("Game", gameSchema);
