package Server.api.twitter;

import java.io.IOException;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import Server.api.Api;
import Server.api.account.Account;

@Path(Twitter.BASE_PATH + "/{" + User.USER_PARAM + "}/" + Twitter.USER_PATH)
public class User {

	static final String USER_PARAM = "user";

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response get(@PathParam(USER_PARAM) String user, @HeaderParam(Api.AUTH_TOKEN_HEADER) String token)
			throws IOException {
		if (!Account.checkLoginToken(token)) {
			return Response.status(Status.FORBIDDEN).build();
		}
		String url = Twitter.BASE_URL + "/" + user;
		Document doc = Twitter.getDocument(url);
		UserObject userInfo = new UserObject();
		Element profile = doc.getElementsByClass("profile").first();
		Element details = profile.getElementsByClass("profile-details").first();
		userInfo.avatar = details.getElementsByClass("avatar").first().child(0).attr("src");
		userInfo.fullname = details.getElementsByClass("fullname").first().ownText();
		userInfo.username = String.join("", details.getElementsByClass("username").first().children().eachText());
		String locationString = details.getElementsByClass("location").first().ownText();
		if (!locationString.equals("")) {
			userInfo.location = locationString;
		}
		String bioString = details.getElementsByClass("bio").first().child(0).html();
		if (!bioString.trim().equals("")) {
			userInfo.bio = bioString;
		}
		String urlString = details.getElementsByClass("url").first().getElementsByTag("a").first().attr("data-url");
		if (!urlString.equals("")) {
			userInfo.url = urlString;
		}
		Element stats = profile.getElementsByClass("profile-stats").first();
		String tweetStat = stats.getElementsByClass("statnum").eq(0).first().ownText();
		userInfo.tweets = Long.parseLong(tweetStat.replace(",", ""));
		String followingStat = stats.getElementsByClass("statnum").eq(1).first().ownText();
		userInfo.following = Long.parseLong(followingStat.replace(",", ""));
		String followersStat = stats.getElementsByClass("statnum").eq(2).first().ownText();
		userInfo.followers = Long.parseLong(followersStat.replace(",", ""));
		return Response.ok(Twitter.toJson(userInfo)).build();
	}
}