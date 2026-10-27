import AppRoutes from "./routes/routes.jsx";
import { ThemeProvider } from "./components/ThemeProvider";
import { AcessibilidadeProvider } from "./components/AcessibilidadeProvider";
import WidgetAcessibilidade from "./components/WidgetAcessibilidade";

function App() {
  return (
    <ThemeProvider>
      <AcessibilidadeProvider>
        <AppRoutes />
        <WidgetAcessibilidade />
      </AcessibilidadeProvider>
    </ThemeProvider>
  );
}

export default App;
