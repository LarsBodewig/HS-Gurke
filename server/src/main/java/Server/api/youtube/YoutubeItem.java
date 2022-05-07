package Server.api.youtube;

import Server.api.account.MenuItem;

public class YoutubeItem implements MenuItem {
	public final String type = "youtube";
	public Integer id;
	public Integer folderId;
	public String title;
	public String url;
	public String lastSeen;
	public String source;

	public YoutubeItem(Integer acc_id, Integer id, Integer folder_id, String title, String url, String last_seen, String prefix,
			String username) {
		this.id = id;
		this.folderId = folder_id;
		this.title = title;
		this.url = url;
		this.lastSeen = last_seen;
		this.source = "/youtube/" + prefix + "/" + username;
	}

	@Override
	public String getTitle() {
		return title;
	}

	@Override
	public Integer getId() {
		return id;
	}
}
