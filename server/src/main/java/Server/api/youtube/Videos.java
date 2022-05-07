package Server.api.youtube;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAmount;
import java.time.temporal.TemporalUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jsoup.Connection;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import Server.api.Api;
import Server.api.account.Account;

@Path(Youtube.BASE_PATH + "/{" + Videos.PREFIX_PARAM + "}/{" + Videos.USER_PARAM + "}")
public class Videos {

	static final String PREFIX_PARAM = "prefix";
	static final String USER_PARAM = "user";
	static final String TO_PARAM = "to";

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get(@PathParam(PREFIX_PARAM) String prefix, @PathParam(USER_PARAM) String user,
			@QueryParam(TO_PARAM) String to, @HeaderParam(Api.AUTH_TOKEN_HEADER) String token) {
		if (!Account.checkLoginToken(token)) {
			return Response.status(Status.FORBIDDEN).build();
		}
		List<VideoObject> results = new ArrayList<>();
		try {
			String url = Youtube.BASE_URL + "/" + prefix + "/" + user + "/" + Youtube.VIDEOS_PATH;
			results = getVideos(results, url, to);
			return Response.ok(Youtube.toJson(results)).build();
		} catch (IOException e) {
			e.printStackTrace();
			if (results.isEmpty()) {
				return Response.status(Status.INTERNAL_SERVER_ERROR).build();
			} else {
				return Response.status(Status.PARTIAL_CONTENT).entity(Youtube.toJson(results)).build();
			}
		}
	}

	public static List<VideoObject> getUnseenVideos(String source, String to) throws IOException {
		String[] url = source.split("\\/");
		return getVideos(new ArrayList<VideoObject>(),
				Youtube.BASE_URL + "/" + url[2] + "/" + url[3] + "/" + Youtube.VIDEOS_PATH, to);
	}

	private static List<VideoObject> getVideos(List<VideoObject> results, String url, String to) throws IOException {
		Connection.Response res = Youtube.getResponse(url);
		Document doc = res.parse();
		Element avatarElement = doc.getElementsByClass("channel-header-profile-image").first();
		String avatar = null;
		try {
			avatar = avatarElement.attr("src");
		} catch (NullPointerException e) {
			Api.log(url);
			return results;
		}
		String author = avatarElement.attr("title");
		Elements videos = doc.getElementsByClass("channels-content-item");
		for (Element video : videos) {
			VideoObject result = new VideoObject();
			Element titleElement = video.getElementsByClass("yt-lockup-title").first().child(0);
			result.source = titleElement.attr("abs:href");
			result.id = video.getElementsByClass("yt-lockup-video").first().attr("data-context-item-id");
			if (result.id.equals(to)) {
				return results;
			}
			result.avatar = avatar;
			result.author = author;
			result.thumbnail = video.getElementsByClass("yt-thumb-clip").first().child(0).attr("src");
			result.title = titleElement.ownText();
			Element metadataElement = video.getElementsByClass("yt-lockup-meta-info").first();
			Element viewsElement = metadataElement.child(0);
			if (viewsElement != null) {
				String views = viewsElement.ownText();
				if (views.contains("Keine")) {
					result.views = 0L;
				} else {
					views = views.substring(0, views.indexOf(" ")).replace(".", "");
					result.views = Long.parseLong(views);
				}
			}
			String timestamp = metadataElement.child(1).ownText();
			if (timestamp.contains("live")) {
				result.live = true;
			} else {
				String[] duration = video.getElementsByClass("video-time").first().child(0).ownText().split(":");
				long seconds = 0;
				for (int i = 0; i < duration.length; i++) {
					seconds += Long.parseLong(duration[duration.length - 1 - i]) * Math.pow(60, i);
				}
				result.duration = seconds;
				result.timestamp = parseTime(timestamp);
			}
			results.add(result);
		}
		Element moreResults = doc.getElementsByClass("load-more-button").first();
		if (moreResults != null && to != null) {
			return parseJson(results, Youtube.BASE_URL + "/" + moreResults.attr("data-uix-load-more-href"), to,
					res.cookies(), res.headers());
		}
		return results;
	}

	private static List<VideoObject> parseJson(List<VideoObject> results, String url, String to,
			Map<String, String> cookies, Map<String, String> headers) throws IOException {
		// Connection.Response res =
		// Jsoup.connect(url).ignoreContentType(true).cookies(cookies).headers(headers)
		// .method(Method.GET).execute();
		// String doc = res.body();
		return results;
	}

	private static Long parseTime(String timestamp) {
		if (timestamp.contains("live")) {
			return null;
		} else {
			LocalDateTime dateTime = LocalDateTime.now();
			TemporalUnit unit = null;
			long amount = Long.parseLong(timestamp.split(" ")[1]);
			switch (timestamp.substring(timestamp.lastIndexOf(' ') + 1)) {
			case "Jahren":
			case "Jahr":
				dateTime = dateTime.minusYears(amount);
				break;
			case "Monaten":
			case "Monat":
				dateTime = dateTime.minusMonths(amount);
				break;
			case "Wochen":
			case "Woche":
				dateTime = dateTime.minusWeeks(amount);
				break;
			case "Tagen":
			case "Tag":
				unit = ChronoUnit.DAYS;
				break;
			case "Stunden":
			case "Stunde":
				unit = ChronoUnit.HOURS;
				break;
			case "Minuten":
			case "Minute":
				unit = ChronoUnit.MINUTES;
				break;
			case "Sekunden":
			case "Sekunde":
				unit = ChronoUnit.SECONDS;
				break;
			}
			if (unit != null) {
				TemporalAmount ta = Duration.of(amount, unit);
				dateTime = dateTime.minus(ta);
			}
			if (unit == null || unit == ChronoUnit.DAYS) {
				dateTime = dateTime.toLocalDate().atStartOfDay();
			}
			return dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
		}
	}
}
