package Server.api.youtube;

import Server.api.Datable;
import Server.api.ItemObject;

public class VideoObject implements ItemObject, Datable {
	public final String type = "youtube";
	public String id;
	public String author;
	public String title;
	public String source;
	public String thumbnail;
	public String avatar;
	public Long duration;
	public Long timestamp;
	public Long views;
	public Boolean live;

	public Long getTimestamp() {
		return timestamp;
	}

	@Override
	public String getId() {
		return id;
	}
}
