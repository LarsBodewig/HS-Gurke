package Server.api.account;

import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

public class MenuFolder implements MenuItem {
	public final String type = "folder";
	public Integer id;
	public Integer parentId;
	public String title;
	public String url;
	public Set<MenuItem> children;

	public MenuFolder(Integer acc_id, Integer id, Integer parent_id, String title, String url) {
		this.id = id;
		this.parentId = parent_id;
		this.title = title;
		this.url = url;
		this.children = new TreeSet<>(new Comparator<MenuItem>() {
			@Override
			public int compare(MenuItem o1, MenuItem o2) {
				if (o1.getClass().equals(o2.getClass())) {
					return o1.getId().compareTo(o2.getId());
				} else if (o1 instanceof MenuFolder) {
					return -1;
				} else if (o2 instanceof MenuFolder) {
					return 1;
				} else {
					return o1.getTitle().compareTo(o2.getTitle());
				}
			}
		});
	}

	public void add(MenuItem child) {
		if (children != null) {
			this.children.add(child);
		}
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