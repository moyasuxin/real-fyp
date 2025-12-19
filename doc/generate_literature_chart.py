import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

# Data
methodologies = ['Classical ML', 'Feature\nSelection', 'Multimodal\nFusion', 'Hybrid &\nEnsemble']
accuracy_values = [85, 88, 92, 95]
colors = ['#FF6B35', '#FF9F5A', '#00B050', '#0070C0']

# Create figure and axis
fig, ax = plt.subplots(figsize=(11, 8), dpi=300)

# Create bars
bars = ax.bar(methodologies, accuracy_values, color=colors, edgecolor='black', linewidth=2, width=0.6)

# Add value labels on top of bars
for bar, value in zip(bars, accuracy_values):
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2., height + 1,
            f'{value}%',
            ha='center', va='bottom', fontsize=14, fontweight='bold', color=colors[accuracy_values.index(value)])

# Customize axes
ax.set_ylabel('Accuracy (%)', fontsize=13, fontweight='bold')
ax.set_xlabel('Methodology Type', fontsize=13, fontweight='bold')
ax.set_title('Methodology Effectiveness Comparison', fontsize=16, fontweight='bold', pad=20)

# Set y-axis limits and grid
ax.set_ylim(0, 110)
ax.set_yticks(np.arange(0, 110, 20))
ax.grid(axis='y', linestyle='--', alpha=0.3, linewidth=0.8)
ax.set_axisbelow(True)

# Add a highlight box for your project
ax.text(0.5, -0.15, 'Your Project Uses: Multimodal Fusion Approach (92%+ Accuracy)',
        transform=ax.transAxes, ha='center', va='top',
        bbox=dict(boxstyle='round,pad=0.8', facecolor='#E8F4F8', edgecolor='#00B050', linewidth=2),
        fontsize=10, fontweight='bold')

# Style improvements
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_linewidth(2)
ax.spines['bottom'].set_linewidth(2)

# Adjust layout
plt.tight_layout()

# Save as PNG at 300 DPI
plt.savefig('literature_review_chart.png', dpi=300, bbox_inches='tight', facecolor='white')
print("✓ Chart saved as 'literature_review_chart.png'")
print("✓ Resolution: 300 DPI (suitable for printing)")
print("✓ Size: Approximately 5.5\" × 4\" at 300 DPI")

plt.show()
