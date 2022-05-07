package Server.db;

import Server.Utils;

class SQL {
	static Update update(String table) {
		return new Update(new StringBuilder("UPDATE ").append(table).append(" "));
	}

	static UpdateCondition deleteFrom(String table) {
		return new UpdateCondition(new StringBuilder("DELETE FROM ").append(table).append(" "));
	}

	static Insert insertInto(String table) {
		return new Insert(new StringBuilder("INSERT INTO ").append(table).append(" "));
	}

	static Select select(String... columns) {
		return new Select(Utils.iterateArray(new StringBuilder("SELECT "), false, columns).append(" "));
	}

	static class Update {
		private StringBuilder st;

		UpdateCondition set(String column, String value) {
			return new UpdateCondition(st.append("SET ").append(column).append(" = ").append(value).append(" "));
		}

		UpdateCondition set(String multiple) {
			return new UpdateCondition(st.append("SET ").append(multiple).append(" "));
		}

		Update(StringBuilder st) {
			this.st = st;
		}
	}

	static class UpdateCondition {
		private StringBuilder st;

		UpdateQuery where(String conditions) {
			return new UpdateQuery(st.append("WHERE ").append(conditions));
		}

		UpdateCondition(StringBuilder st) {
			this.st = st;
		}
	}

	static class Insert {
		private StringBuilder st;

		UpdateQuery values(String[] columns, String[] values) {
			return new UpdateQuery(
					Utils.iterateArray(Utils.iterateArray(st, true, columns).append(" VALUES "), true, values));
		}

		Insert(StringBuilder st) {
			this.st = st;
		}
	}

	static class UpdateQuery {
		private String query;

		UpdateQuery(StringBuilder sb) {
			query = sb.toString();
		}

		String query() {
			return query;
		}
	}

	static class Select {
		private StringBuilder st;

		From from(String... tables) {
			return new From(Utils.iterateArray(st.append("FROM "), false, tables).append(" "));
		}

		Select(StringBuilder st) {
			this.st = st;
		}
	}

	static class From extends SelectQuery {
		Join joinOn(String joins) {
			return new Join(st.append(joins).append(" "));
		}

		SelectCondition where(String conditions) {
			return new SelectCondition(st.append("WHERE ").append(conditions).append(" "));
		}

		From(StringBuilder st) {
			super(st);
		}
	}

	static class Join {
		private StringBuilder st;

		SelectCondition where(String conditions) {
			return new SelectCondition(st.append("WHERE ").append(conditions).append(" "));
		}

		SelectCondition where(String column, String operator, SelectQuery subSelect) {
			return new SelectCondition(st.append("WHERE ").append(column).append(" ").append(operator).append(" (")
					.append(subSelect.query()).append(") "));
		}

		Join(StringBuilder st) {
			this.st = st;
		}
	}

	static class SelectCondition extends SelectQuery {

		Group groupBy(String group) {
			return new Group(st.append("GROUP BY ").append(group).append(" "));
		}

		Order orderBy(String order) {
			return new Order(st.append("ORDER BY ").append(order).append(" "));
		}

		SelectCondition(StringBuilder st) {
			super(st);
		}
	}

	static class Group extends SelectQuery {

		Having having(String having) {
			return new Having(st.append("HAVING ").append(having).append(" "));
		}

		Order orderBy(String order) {
			return new Order(st.append("ORDER BY ").append(order).append(" "));
		}

		Group(StringBuilder st) {
			super(st);
		}
	}

	static class Having extends SelectQuery {

		Order orderBy(String order) {
			return new Order(st.append("ORDER BY ").append(order).append(" "));
		}

		Having(StringBuilder st) {
			super(st);
		}
	}

	static class Order extends SelectQuery {

		Order(StringBuilder st) {
			super(st);
		}
	}

	static abstract class SelectQuery {
		protected StringBuilder st;

		protected SelectQuery(StringBuilder st) {
			this.st = st;
		}

		String query() {
			return st.toString();
		}

		Select combine(String combine) {
			return new Select(st.append(combine).append(" "));
		}
	}
}
