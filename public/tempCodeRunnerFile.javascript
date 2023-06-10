import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import java.io.IOException;

public class QuotePareggioRealTime {

    public static void main(String[] args) {
        String url = "https://www.betfair.it/exchange/plus/it/calcio/uefa-champions-league/manchester-city-real-madrid-scommesse-32339562";
        try {
            while (true) {
                // Effettua una richiesta HTTP al sito web
                Document document = Jsoup.connect(url).get();

                // Estrapola le quote di pareggio
                Elements quoteElements = document.select(".lay .ui-runner-price");
                for (Element quoteElement : quoteElements) {
                    String quote = quoteElement.text();
                    System.out.println("Quote pareggio: " + quote);
                }

                // Aspetta 5 secondi prima di fare una nuova richiesta
                Thread.sleep(5000);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
