export default function StrategyForm() {
  const handleSubmit = (e) =&gt; {
    e.preventDefault();
    // Handle form submission
  };

  return (
    &lt;form className="strategy-form" onSubmit={handleSubmit}&gt;
      &lt;div className="form-group"&gt;
        &lt;label&gt;Strategy Name&lt;/label&gt;
        &lt;input type="text" required /&gt;
      &lt;/div&gt;
      &lt;div className="form-group"&gt;
        &lt;label&gt;Parameters&lt;/label&gt;
        &lt;textarea rows="4" required&gt;&lt;/textarea&gt;
      &lt;/div&gt;
      &lt;button type="submit"&gt;Save Strategy&lt;/button&gt;
    &lt;/form&gt;
  );
}
