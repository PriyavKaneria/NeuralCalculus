#!/bin/bash

INPUT_PDF="Interesume v1.2-public.pdf"
OUTPUT_PDF="output_with_alert.pdf"
TEMP_PDF="temp_js.pdf"

# Create a minimal PDF with JavaScript
cat << EOF > "$TEMP_PDF"
%PDF-1.3
1 0 obj
<< /Type /Catalog
   /Pages 2 0 R
   /OpenAction 4 0 R
>>
endobj
2 0 obj
<< /Type /Pages
   /Kids [3 0 R]
   /Count 1
>>
endobj
3 0 obj
<< /Type /Page
   /Parent 2 0 R
   /MediaBox [0 0 612 792]
>>
endobj
4 0 obj
<< /Type /Action
   /S /JavaScript
   /JS (app.alert("This PDF is old.", 3);)
>>
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000096 00000 n 
0000000158 00000 n 
0000000231 00000 n 
trailer
<< /Size 5
   /Root 1 0 R
>>
startxref
331
%%EOF
EOF

# Merge the temporary PDF with the original PDF
qpdf --empty --pages "$TEMP_PDF" 1 "$INPUT_PDF" 1-z -- "$OUTPUT_PDF"

# Clean up
rm "$TEMP_PDF"

echo "PDF with alert created: $OUTPUT_PDF"