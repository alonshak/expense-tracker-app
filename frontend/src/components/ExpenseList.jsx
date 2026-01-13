import ExpenseRow from "./ExpenseRow";

export default function ExpenseList({ expenses, hasMore, onLoadMore }) {
  return (
    <section>
      <h2 style={{ marginBottom: 12, color: "#111827" }}>
        Expenses
      </h2>

      <div
        style={{
          background: "#D0C7B3",
          borderRadius: 16,
          padding: 16,
          border: "1px solid #bdb4a2",
        }}
      >
        {expenses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 32,
              color: "#525252",
            }}
          >
            No expenses for this month
          </div>
        ) : (
          <>
            {expenses.map((e) => (
              <ExpenseRow key={e.id} expense={e} />
            ))}

            {hasMore && (
              <button
                onClick={onLoadMore}
                style={{
                  marginTop: 16,
                  width: "100%",
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid #43442b",
                  background: "transparent",
                  color: "#43442b",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Load more
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
