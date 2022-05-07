package Server.api.twitter;

import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import Server.api.Api;

abstract class Twitter {

	static final String BASE_PATH = "twitter";
	static final String USER_PATH = "user";
	static final String POSTS_PATH = "posts";

	static final String BASE_URL = "https://twitter.com";

	private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.874.120 Safari/535.2";

	static String toJson(Object o) {
		return Api.gson.toJson(o);
	}

	static Document getDocument(String url) throws IOException {
		return Jsoup.connect(url).userAgent(USER_AGENT).get();
	}
}
