import { NextResponse } from "next/server"

const resError = (msg) => {
    return NextResponse.json({
        success: false,
        message: msg,
      });
}

export default resError;