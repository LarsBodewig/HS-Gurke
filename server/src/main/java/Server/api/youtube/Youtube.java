package Server.api.youtube;

import java.io.IOException;

import org.jsoup.Connection.Method;
import org.jsoup.Connection.Response;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import com.google.gson.Gson;

abstract class Youtube {

	static final String BASE_PATH = "youtube";
	static final String VIDEOS_PATH = "videos";

	static final String BASE_URL = "https://youtube.com";

	private static final Gson gson = new Gson();

	static String toJson(Object o) {
		return gson.toJson(o);
	}

	static Document getDocument(String url) throws IOException {
		return Jsoup.connect(url).get();
	}

	static Response getResponse(String url) throws IOException {
		return Jsoup.connect(url).method(Method.GET).execute();
	}
}
