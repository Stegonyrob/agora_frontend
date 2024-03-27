import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    texts: [
        {
            id:"1",
             image: "../../../public/images/img/edificio.jpg",
             imageName:"edificio",
             description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. ",
             
           },
           {
             id:"2",
             image: "../../../public/images/img/escritorio.jpg",
             imageName:"escritorio",
             description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. ",
             
           },
         
           {
             id:"3",
             image: "../../../public/images/img/niñoPuzzle.jpg",
             imageName:"niñoPuzzle",
             description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
             
           },
           {
             id:"4",
             image: "../../../public/images/img/niñaFicha.jpg",
             imageName:"niñaFicha",
             description: " Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
             
           },
           {
             id:"5",
             image: "../../../public/images/img/alumnosOrdenador.jpg",
             imageName:"alumnosOrdenador",
             description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
             
           },
           {
             id:"6",
             image: "../../../public/images/img/adolescentesGrupal.jpg",
             imageName:"adolescentesGrupal",
             description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
             
           },
           {
             id:"7",
             image: "../../../public/images/img/niñoFichas.jpg",
             imageName:"eniñoFichas",
             description: " Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
             
           },
           {
             id:"8",
             image: "../../../public/images/img/niñaFicha.jpg",
             imageName:"niñaFicha",
             description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
             
           },
           {
             id:"9",
             image: "../../../public/images/img/niñoPuzzle.jpg",
             imageName:"edificio",
             description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
             
           },
           {
             id:"10",
             image: "../../../public/images/img/niñoCascos.jpg",
             imageName:"niñoCascos",
             description: " Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
             
           },
           {
             id:"11",
             image: "../../../public/images/img/alumnosOrdenador.jpg",
             imageName:"alumnosOrdenador",
             description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
             
           },
           {
            id:"12",
            image: "../../../public/images/img/alumnosOrdenador.jpg",
            imageName:"alumnosOrdenador",
            description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
            
          },
          {
            id:"13",
            image: "../../../public/images/img/alumnosOrdenador.jpg",
            imageName:"alumnosOrdenador",
            description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
            
          },
          {
           id:"14",
           image: "../../../public/images/img/alumnosOrdenador.jpg",
           imageName:"alumnosOrdenador",
           description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
           
         },
         {
          id:"15",
          image: "../../../public/images/img/ivan.jpg",
          imageName:"ivan",
          description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
          
        }
    ],
    textIndex :0,
    

}
const textsSlice = createSlice({
    name: 'texts',
    initialState,
    reducers: {
       nextSlide: (state) => {
         if (state.textIndex < state.texts.length - 1) {
           state.textIndex += 1;
         }
       },
       prevSlide: (state) => {
         if (state.textIndex > 0) {
           state.textIndex -= 1;
         }
       },},
});
export const { nextSlide, prevSlide } = textsSlice.actions;
export default textsSlice.reducer;