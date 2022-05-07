package Server.api.twitter;

import java.io.IOException;
import java.text.ParseException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.MonthDay;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAmount;
import java.time.temporal.TemporalUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jsoup.HttpStatusException;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import Server.api.Api;
import Server.api.account.Account;

@Path(Twitter.BASE_PATH + "/{" + Posts.USER_PARAM + "}/" + Twitter.POSTS_PATH)
public class Posts {

	static final String USER_PARAM = "user";
	static final String FROM_PARAM = "from";
	static final String TO_PARAM = "to";
	static final String REPLIES_PARAM = "replies";
	static final String REPLIES_PARAM_DEFAULT = "true";

	private static final DateTimeFormatter MONTH_DAY_FORMATTER = DateTimeFormatter.ofPattern("MMM d", Locale.US);
	private static final DateTimeFormatter FULL_DATE_FORMATTER = DateTimeFormatter.ofPattern("d MMM yy", Locale.US);

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get(@PathParam(USER_PARAM) String user, @QueryParam(FROM_PARAM) String from,
			@QueryParam(TO_PARAM) String to,
			@QueryParam(REPLIES_PARAM) @DefaultValue(REPLIES_PARAM_DEFAULT) boolean replies,
			@HeaderParam(Api.AUTH_TOKEN_HEADER) String token) throws IOException, ParseException {
		if (!Account.checkLoginToken(token)) {
			return Response.status(Status.FORBIDDEN).build();
		}
		List<TweetObject> results = new ArrayList<>();
		String url = Twitter.BASE_URL + "/" + user;
		if (from != null && from.matches("^[-,0-9]+$")) {
			url += "?max_id=" + from;
		}
		if (to != null && !to.matches("^[-,0-9]+$")) {
			to = null;
		}
		try {
			results = getTweets(results, url, to, replies);
			return Response.ok(Twitter.toJson(results)).build();
		} catch (IOException io) {
			if (io instanceof HttpStatusException && ((HttpStatusException) io).getStatusCode() == 429) {
				Api.log("Catched Exception: Exceeded twitter rate limit - on cooldown.", "\t" + io);
			}
			if (results.isEmpty()) {
				return Response.status(Status.INTERNAL_SERVER_ERROR).build();
			} else {
				return Response.status(Status.PARTIAL_CONTENT).entity(Twitter.toJson(results)).build();
			}
		}
	}

	public static List<TweetObject> getUnseenTweets(String source, String to) throws IOException {
		String[] temp = source.split("\\/");
		String user = temp[2];
		temp = temp[3].split("\\?|&");
		boolean replies = true;
		for (String param : temp) {
			String[] keyValue = param.split("=");
			if (keyValue[0].equals(TO_PARAM)) {
				replies = Boolean.valueOf(keyValue[1]);
			}
		}
		return getTweets(new ArrayList<TweetObject>(), Twitter.BASE_URL + "/" + user, to, replies);
	}

	private static List<TweetObject> getTweets(List<TweetObject> results, String from, String to, boolean replies)
			throws IOException {
		Document doc = Twitter.getDocument(from);
		Elements tweets = doc.getElementsByClass("tweet");
		for (Element tweet : tweets) {
			TweetObject result = new TweetObject();
			result.id = tweet.getElementsByClass("tweet-text").attr("data-id");
			if (result.id.equals(to)) {
				return results;
			}
			result.author = tweet.getElementsByClass("username").first().ownText();
			result.source = Twitter.BASE_URL + tweet.attr("href");
			Element post = tweet.getElementsByClass("tweet-text").first();
			result.post = post.child(0).html();
			String timestamp = tweet.getElementsByClass("timestamp").first().child(0).ownText();
			result.timestamp = parseTime(timestamp);
			Element reply = tweet.getElementsByClass("tweet-reply-context").first();
			if (reply != null) {
				result.reply = reply.getElementsByTag("a").first().text();
			}
			Element retweet = tweet.getElementsByClass("tweet-social-context").first();
			result.retweet = retweet != null;
			result.avatar = tweet.getElementsByClass("avatar").first().child(0).child(0).attr("src");
			Element media = post.getElementsByAttribute("data-pre-embedded").first();
			if (media != null) {
				result.media = media.attr("data-url");
			}
			if (result.reply != null && replies || result.reply == null) {
				results.add(result);
			}
		}
		Element moreResults = doc.getElementsByClass("w-button-more").first();
		if (moreResults != null && to != null) {
			return getTweets(results, moreResults.child(0).attr("abs:href"), to, replies);
		} else {
			return results;
		}
	}

	private static long parseTime(String timestamp) {
		LocalDateTime date = null;
		if (timestamp.matches("^[1-5]?[0-9](m|h|s)$")) {
			TemporalUnit unit = null;
			switch (timestamp.charAt(timestamp.length() - 1)) {
			case 'h':
				unit = ChronoUnit.HOURS;
				break;
			case 'm':
				unit = ChronoUnit.MINUTES;
				break;
			case 's':
				unit = ChronoUnit.SECONDS;
				break;
			}
			String amountString = timestamp.substring(0, timestamp.length() - 1);
			TemporalAmount amount = Duration.of(Long.parseLong(amountString), unit);
			date = LocalDateTime.now().minus(amount);
		} else if (timestamp.matches("^[A-Z][a-z]{2} [1-3]?[0-9]$")) {
			MonthDay md = MonthDay.parse(timestamp, MONTH_DAY_FORMATTER);
			if (md.atYear(LocalDate.now().getYear()).isBefore(LocalDate.now())) {
				date = md.atYear(LocalDate.now().getYear()).atStartOfDay();
			} else {
				date = md.atYear(LocalDate.now().minus(1L, ChronoUnit.YEARS).getYear()).atStartOfDay();
			}
		} else if (timestamp.matches("^[1-3]?[0-9] [A-Z][a-z]{2} [0-9]{2}$")) {
			date = LocalDate.parse(timestamp, FULL_DATE_FORMATTER).atStartOfDay();
		}
		return date.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
	}
}
