export default function DataTable({ data }) {
  return (
    &lt;div className="data-table"&gt;
      &lt;table&gt;
        &lt;thead&gt;
          &lt;tr&gt;
            &lt;th&gt;Timestamp&lt;/th&gt;
            &lt;th&gt;Symbol&lt;/th&gt;
            &lt;th&gt;Price&lt;/th&gt;
            &lt;th&gt;Volume&lt;/th&gt;
          &lt;/tr&gt;
        &lt;/thead&gt;
        &lt;tbody&gt;
          {data.map((row, index) =&gt; (
            &lt;tr key={index}&gt;
              &lt;td&gt;{row.timestamp}&lt;/td&gt;
              &lt;td&gt;{row.symbol}&lt;/td&gt;
              &lt;td&gt;{row.price}&lt;/td&gt;
              &lt;td&gt;{row.volume}&lt;/td&gt;
            &lt;/tr&gt;
          ))}
        &lt;/tbody&gt;
      &lt;/table&gt;
    &lt;/div&gt;
  );
}
