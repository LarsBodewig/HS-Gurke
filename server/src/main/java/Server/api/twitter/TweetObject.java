package Server.api.twitter;

import Server.api.Datable;
import Server.api.ItemObject;

public class TweetObject implements ItemObject, Datable {
	public final String type = "twitter";
	public String id;
	public String author;
	public String source;
	public String post;
	public long timestamp;
	public String reply;
	public boolean retweet;
	public String avatar;
	public String media;

	public Long getTimestamp() {
		return timestamp;
	}

	@Override
	public String getId() {
		return id;
	}
}