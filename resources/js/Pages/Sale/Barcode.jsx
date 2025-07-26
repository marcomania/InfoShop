import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const Barcode = ({ value = '123456789012', width = 1.5, height = 30, displayValue = false }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: 'CODE128',
        lineColor: '#000',
        width,
        height,
        displayValue,
      });
    }
  }, [value, width, height, displayValue]);

  return <svg ref={svgRef} />;
};

export default Barcode;