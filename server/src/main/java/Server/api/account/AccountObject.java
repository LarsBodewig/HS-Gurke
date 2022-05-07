package Server.api.account;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import Server.api.Api;
import Server.api.Datable;
import Server.api.twitter.Posts;
import Server.api.twitter.TweetObject;
import Server.api.twitter.TwitterItem;
import Server.api.youtube.VideoObject;
import Server.api.youtube.Videos;
import Server.api.youtube.YoutubeItem;
import Server.db.Database;

public class AccountObject {
	public int id;
	public String email;
	public String hash;
	public boolean verified;
	public String securityCode;
	public MenuFolder items;
	public Datable[] unseen;

	public AccountObject(Integer id, String email, String hash, Boolean verified, String securityCode) {
		this.id = id;
		this.email = email;
		this.hash = hash;
		this.verified = verified;
		this.securityCode = securityCode;
	}

	public void filterUnseen() {
		Set<Datable> set = new TreeSet<>(new Comparator<Datable>() {
			@Override
			public int compare(Datable o1, Datable o2) {
				if (o1.getId().equals(o2.getId())) {
					return 0;
				}
				return o1.getTimestamp().compareTo(o2.getTimestamp());
			}
		});
		Map<Integer, TwitterItem> twitter = Database.getMenuItems(id, "item_twitter", "id", TwitterItem.class);
		twitter.forEach((tId, page) -> {
			try {
				List<TweetObject> pageTweets = Posts.getUnseenTweets(page.source, page.lastSeen);
				set.addAll(pageTweets);
				if (!pageTweets.isEmpty()) {
					Database.updateTable("item_twitter", "id", tId, "last_seen", pageTweets.get(0).id);
				}
			} catch (IOException e) {
				Api.log(e);
			}
		});
		Map<Integer, YoutubeItem> youtube = Database.getMenuItems(id, "item_youtube", "id", YoutubeItem.class);
		youtube.forEach((yId, page) -> {
			try {
				List<VideoObject> pageVideos = Videos.getUnseenVideos(page.source, page.lastSeen);
				set.addAll(pageVideos);
				if (!pageVideos.isEmpty()) {
					Database.updateTable("item_youtube", "id", yId, "last_seen", pageVideos.get(0).id);
				}
			} catch (IOException e) {
				Api.log(e);
			}
		});
		unseen = set.toArray(new Datable[set.size()]);
	}

	public void buildTreeFolder() {
		MenuFolder root = new MenuFolder(null, 0, null, null, null);
		Map<Integer, MenuFolder> folders = Database.getMenuItems(id, "folder", "parent_id", MenuFolder.class);
		folders.forEach((k, v) -> {
			if (v.parentId == 0) {
				root.add(v);
			} else {
				folders.get(v.parentId).add(v);
			}
		});
		Map<Integer, TwitterItem> twitter = Database.getMenuItems(id, "item_twitter", "folder_id", TwitterItem.class);
		twitter.forEach((k, v) -> {
			if (v.folderId == 0) {
				root.add(v);
			} else {
				folders.get(v.folderId).add(v);
			}
		});
		Map<Integer, YoutubeItem> youtube = Database.getMenuItems(id, "item_youtube", "folder_id", YoutubeItem.class);
		youtube.forEach((k, v) -> {
			if (v.folderId == 0) {
				root.add(v);
			} else {
				folders.get(v.folderId).add(v);
			}
		});
		items = root;
	}
}
