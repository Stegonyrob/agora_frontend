import React from "react";

export interface IPostDTO {
  id: number;
  title: string;
  message: React.ReactNode;
  creation_date: string;
  postname: string;
  userId: number;
}
