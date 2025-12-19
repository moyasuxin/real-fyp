import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import Rectangle
import numpy as np

# Create figure and axis
fig, ax = plt.subplots(figsize=(11, 10), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

# Title
ax.text(5, 9.5, 'Traditional vs Proposed Assessment', 
        ha='center', va='center', fontsize=16, fontweight='bold')

# Table data
headers = ['Assessment Method', 'Traditional (CGPA)', 'Proposed (Multimodal)']
rows = [
    ['Academic Performance', '✓', '✓'],
    ['Co-curricular Analysis', '✗', '✓'],
    ['Lecturer Feedback (AI)', '✗', '✓'],
    ['Digital Footprints', '✗', '✓'],
    ['Predictive Analytics', '✗', '✓ (92.5%)'],
    ['Career Recommendations', '✗', '✓ (6 paths)'],
    ['Total Capabilities', '2/6', '6/6']
]

# Table dimensions
col_widths = [3.5, 3.2, 3.3]
row_height = 0.45
start_x = 0.5
start_y = 8.8

# Draw header
header_colors = ['#003366', '#ffcccc', '#ccffcc']
for i, (header, width, color) in enumerate(zip(headers, col_widths, header_colors)):
    x = start_x + sum(col_widths[:i])
    rect = Rectangle((x, start_y - row_height), width, row_height, 
                     linewidth=1.5, edgecolor='#333333', facecolor=color)
    ax.add_patch(rect)
    
    # Header text
    text_color = 'white' if i == 0 else '#333333'
    ax.text(x + width/2, start_y - row_height/2, header, 
           ha='center', va='center', fontsize=11, fontweight='bold', color=text_color)

# Draw rows
for row_idx, row_data in enumerate(rows):
    y = start_y - row_height * (row_idx + 1)
    
    # Alternate row colors
    bg_color = '#f5f5f5' if row_idx % 2 == 0 else '#ffffff'
    
    # Last row special styling
    if row_idx == len(rows) - 1:
        bg_color = '#003366'
        text_color_col0 = 'white'
    else:
        text_color_col0 = '#333333'
    
    for col_idx, (cell_data, width) in enumerate(zip(row_data, col_widths)):
        x = start_x + sum(col_widths[:col_idx])
        rect = Rectangle((x, y - row_height), width, row_height, 
                         linewidth=1, edgecolor='#cccccc', facecolor=bg_color)
        ax.add_patch(rect)
        
        # Cell text
        if row_idx == len(rows) - 1:  # Last row (totals)
            text_color = 'white'
            fontweight = 'bold'
        elif col_idx == 0:  # First column
            text_color = text_color_col0
            fontweight = 'bold'
        else:
            # Color check/cross based on value
            if '✓' in cell_data:
                text_color = '#00B050'
            elif '✗' in cell_data:
                text_color = '#ff6b6b'
            else:
                text_color = '#333333'
            fontweight = 'bold'
        
        ax.text(x + width/2, y - row_height/2, cell_data, 
               ha='center', va='center', fontsize=11, fontweight=fontweight, color=text_color)

# Add improvement note at bottom
note_box = Rectangle((0.5, 0.1), 9, 0.5, linewidth=2, edgecolor='#00B050', facecolor='#E8F4F8')
ax.add_patch(note_box)
ax.text(5, 0.35, 'Improvement: +200% more assessment dimensions', 
       ha='center', va='center', fontsize=10, fontweight='bold', color='#333333')

plt.tight_layout()
plt.savefig('comparison_table.png', dpi=300, bbox_inches='tight', facecolor='white')
print("✓ Comparison table saved as 'comparison_table.png'")
print("✓ Resolution: 300 DPI (suitable for printing)")
print("✓ Size: Approximately 5.5\" × 5\" at 300 DPI")

plt.show()
