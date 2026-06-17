import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { DesignData, TextProperties, ImageProperties } from '@/lib/types';

const pdfSizeMap: Record<string, number> = { '8x8': 576, '10x10': 720, '12x12': 864 };
const canvasSizeMap: Record<string, number> = { '8x8': 480, '10x10': 540, '12x12': 600 };

// Helper to convert hex to rgb fractions
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  } : { r: 1, g: 1, b: 1 };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const designData = JSON.parse(project.designData) as DesignData;
    const sizeStr = designData.bookConfig.size;
    
    const pdfSize = pdfSizeMap[sizeStr] || 576;
    const canvasSize = canvasSizeMap[sizeStr] || 480;
    const scale = pdfSize / canvasSize;

    const pdfDoc = await PDFDocument.create();
    
    // Embed standard fonts for now
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Render each page
    for (const pageData of designData.pages) {
      const page = pdfDoc.addPage([pdfSize, pdfSize]);
      
      // Background
      if (pageData.background.type === 'color' && pageData.background.value) {
        const c = hexToRgb(pageData.background.value);
        page.drawRectangle({
          x: 0,
          y: 0,
          width: pdfSize,
          height: pdfSize,
          color: rgb(c.r, c.g, c.b),
        });
      }

      // Sort elements by zIndex
      const elements = [...pageData.elements].sort((a, b) => a.zIndex - b.zIndex);

      for (const el of elements) {
        const scaledX = el.x * scale;
        // pdf-lib's origin (0,0) is bottom-left, our canvas is top-left
        const scaledY = pdfSize - (el.y * scale) - (el.height * scale);
        const scaledW = el.width * scale;
        const scaledH = el.height * scale;

        if (el.type === 'image') {
          const props = el.properties as ImageProperties;
          if (props.src && props.src.startsWith('data:image')) {
            try {
              let image;
              if (props.src.startsWith('data:image/jpeg') || props.src.startsWith('data:image/jpg')) {
                image = await pdfDoc.embedJpg(props.src);
              } else if (props.src.startsWith('data:image/png')) {
                image = await pdfDoc.embedPng(props.src);
              }
              
              if (image) {
                // Determine opacity
                const opacity = typeof props.opacity === 'number' ? props.opacity : 1;
                
                // Rotation handling requires translating to center, rotating, then drawing
                // For simplicity in MVP, we ignore complex rotations, but let's apply basic rotation
                page.drawImage(image, {
                  x: scaledX,
                  y: scaledY,
                  width: scaledW,
                  height: scaledH,
                  opacity: opacity,
                  // Note: full rotation logic requires degrees to radians and center offset
                });
              }
            } catch (e) {
              console.error('Failed to embed image:', e);
            }
          }
        } else if (el.type === 'text') {
          const props = el.properties as TextProperties;
          const font = (props.fontWeight === '700' || props.fontWeight === '600') ? fontBold : fontRegular;
          const fontSize = (props.fontSize || 16) * scale;
          const c = hexToRgb(props.color || '#000000');
          
          // PDF text anchor is bottom-left of the text line, canvas is top-left of the bounding box.
          // Rough approximation: y coordinate shifted by font size
          page.drawText(props.content, {
            x: scaledX,
            y: scaledY + scaledH - fontSize, // Adjust for top-left baseline vs bottom-left
            font: font,
            size: fontSize,
            color: rgb(c.r, c.g, c.b),
            maxWidth: scaledW,
            lineHeight: props.lineHeight ? props.lineHeight * fontSize : 1.4 * fontSize,
          });
        }
      }
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="photobook-${project.id}.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate PDF' }, { status: 500 });
  }
}
