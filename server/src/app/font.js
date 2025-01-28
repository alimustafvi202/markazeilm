import { Libre_Baskerville, Poppins } from "next/font/google";

const weight = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
const style = ["normal", "italic", "bold"];

// Import multiple fonts here
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const libre_baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});
