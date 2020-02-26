import React,{Component} from "react";
import {Spin} from "antd";

export default function Loading() {
    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Spin />
        </div>
    )
}