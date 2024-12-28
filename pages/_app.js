import { TrackingProvider } from "../Conetxt/TrackingContext";
import "../styles/globals.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <TrackingProvider>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </TrackingProvider>
  );
}
