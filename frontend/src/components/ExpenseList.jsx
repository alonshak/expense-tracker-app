import ExpenseRow from "./ExpenseRow";

export default function ExpenseList({ expenses, hasMore, onLoadMore }) {
  return (
    <section>
      <h2 style={{ marginBottom: 12, color: "#111827" }}>
        Expenses
      </h2>

      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 16,
          border: "1px solid #e5e7eb",
        }}
      >
        {expenses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 32,
              color: "#6b7280",
            }}
          >
            No expenses for this month
          </div>
        ) : (
          <>
            {expenses.map(e => (
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
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  cursor: "pointer",
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
