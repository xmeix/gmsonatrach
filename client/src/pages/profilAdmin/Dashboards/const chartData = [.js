 

<div
  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: "20px" }}
>
  {chartData.map((chart, index) => {
    return chart.shouldRender ? (
      <div key={index} className="box">
        <Suspense fallback={<div>Loading...</div>}>
          <chart.type
            data={chart.data}
            type={chart.typeProp}
            label={chart.label}
            labelType={chart.labelType}
            title={chart.title}
            style={chart.style}
          />
        </Suspense>
      </div>
    ) : null;
  })}
</div>;
