import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  texts: [
    {
      id: "1",
      image: "../../../public/images/img/edificio.jpg",
      imageName: "edificio",
      description:
        "Somos un centro educativo que trabaja en el ámbito de la neurodiversidad así como en el refuerzo educativo individualizado. Nuestro objetivo principal es el desarrollo de personas respetando su individualidad y concentrándonos en sus potencialidades, priorizando a la persona como elemento clave de la intervención.  ",
    },
    {
      id: "2",
      image: "../../../public/images/img/escritorio.jpg",
      imageName: "escritorio",
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. ",
    },

    {
      id: "3",
      image: "../../../public/images/img/niñoPuzzle.jpg",
      imageName: "niñoPuzzle",
      description:
        "Reeducación pedagógica,Apoyo educativo,Intervención en NEE y NEAE,Cuidado especializado por horas,Intervención educativa con familias y en el hogar,Coordinación multidisciplinar con centros educativos y particulares,Somos beneficiarios de las becas de reeducación pedagógica de NEAE y NEE,.",
    },
    {
      id: "4",
      image: "../../../public/images/img/niñaFicha.jpg",
      imageName: "niñaFicha",
      description:
        " Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
    },
    {
      id: "5",
      image: "../../../public/images/img/alumnosOrdenador.jpg",
      imageName: "alumnosOrdenador",
      description:
        "El término neurodiversidad describe las diferencias cerebrales de las personas. La idea es que no hay una forma “correcta” de funcionamiento del cerebro. Por el contrario, existe una amplia gama de formas en que las personas perciben y responden al mundo, con distintas fortalezas y limitaciones.",
    },
    {
      id: "6",
      image: "../../../public/images/img/adolescentesGrupal.jpg",
      imageName: "adolescentesGrupal",
      description:
        " Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
    },
    {
      id: "7",
      image: "../../../public/images/img/niñoFichas.jpg",
      imageName: "eniñoFichas",
      description:
        "Solo desde la concepción del autismo como una neurodivergencia, una percepción distinta del mundo, podemos ayudar a cambiar el concepto que se tiene del mismo.Y esta transformación conceptual pasa por cambiar el mundo y no a las personas en el espectro. Daniel Millán López Guía autista: Consejos para sobrevivir en el loco mundo de los neurotípicos.Editorial Lulu.",
    },
    {
      id: "8",
      image: "../../../public/images/img/niñaFicha.jpg",
      imageName: "niñaFicha",
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
    },
    {
      id: "9",
      image: "../../../public/images/img/niñoPuzzle.jpg",
      imageName: "edificio",
      description:
        "Russel Barkley nos dirá que el TDAH no se limita a los síntomas de inatención, impulsividad e hiperactividad, sino que tienen una dificultad importante en las funciones ejecutivas localizadas en el lóbulo frontal. ",
    },
    {
      id: "10",
      image: "../../../public/images/img/niñoCascos.jpg",
      imageName: "niñoCascos",
      description:
        " Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
    },
    {
      id: "11",
      image: "../../../public/images/img/alumnosOrdenador.jpg",
      imageName: "alumnosOrdenador",
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
    },
    {
      id: "12",
      image: "../../../public/images/img/alumnosOrdenador.jpg",
      imageName: "alumnosOrdenador",
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
    },
    {
      id: "13",
      image: "../../../public/images/img/alumnosOrdenador.jpg",
      imageName: "alumnosOrdenador",
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
    },
    {
      id: "14",
      image: "../../../public/images/img/alumnosOrdenador.jpg",
      imageName: "alumnosOrdenador",
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
    },
    {
      id: "15",
      image: "../../../public/images/img/ivan.jpg",
      imageName: "ivan",
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed euismod, nunc at cursus pellentesque, nisl eros pellentesque quam, a faucibus nisl nunc id nisl.",
    },
  ],
  textIndex: 0,
};
const textsSlice = createSlice({
  name: "texts",
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
    },
  },
});
export const { nextSlide, prevSlide } = textsSlice.actions;
export default textsSlice.reducer;
