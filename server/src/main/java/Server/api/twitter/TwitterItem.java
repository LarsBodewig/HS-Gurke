package Server.api.twitter;

import Server.api.account.MenuItem;

public class TwitterItem implements MenuItem {
	public final String type = "twitter";
	public Integer id;
	public Integer folderId;
	public String title;
	public String url;
	public String lastSeen;
	public String source;

	public TwitterItem(Integer acc_id, Integer id, Integer folder_id, String title, String url, String last_seen,
			String username, Boolean replies) {
		this.id = id;
		this.folderId = folder_id;
		this.title = title;
		this.url = url;
		this.lastSeen = last_seen;
		this.source = "/" + Twitter.BASE_PATH + "/" + username + "/" + Twitter.POSTS_PATH
				+ ((replies != null && !replies) ? "?" + Posts.REPLIES_PARAM + "=false" : "");
	}
	
	// menuItem method to save to database?

	@Override
	public String getTitle() {
		return title;
	}

	@Override
	public Integer getId() {
		return id;
	}
}
