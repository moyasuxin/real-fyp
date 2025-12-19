"""
Generate a six-dimensional MQF competency radar chart for Muhammad Ali.
Outputs: public/figure4_radar.png
"""
import matplotlib.pyplot as plt
import numpy as np

# MQF scores (from conference paper)
categories = [
    'Social',
    'Communication',
    'Practical',
    'Problem-Solving',
    'Personal/\nEntrepreneurial',
    'Knowledge'
]
values = [78, 72, 52, 61, 64, 68]

# Number of variables
N = len(categories)

# Compute angle for each axis
angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
values += values[:1]  # close the plot
angles += angles[:1]

# Create figure
fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(projection='polar'))
ax.plot(angles, values, 'o-', linewidth=2, color='#1c7ed6', label='Muhammad Ali')
ax.fill(angles, values, alpha=0.25, color='#4dabf7')

# Set category labels
ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, fontsize=11)

# Set radial limits and labels
ax.set_ylim(0, 100)
ax.set_yticks([20, 40, 60, 80, 100])
ax.set_yticklabels(['20', '40', '60', '80', '100'], fontsize=9, color='gray')
ax.set_theta_offset(np.pi / 2)
ax.set_theta_direction(-1)

# Grid styling
ax.grid(color='gray', linestyle='--', linewidth=0.5, alpha=0.7)
ax.spines['polar'].set_color('gray')
ax.spines['polar'].set_linewidth(0.5)

# Title
plt.title('Six-Dimensional MQF Competency Profile: Muhammad Ali', 
          fontsize=14, fontweight='bold', pad=20)

# Legend
ax.legend(loc='upper right', bbox_to_anchor=(1.2, 1.1), fontsize=10)

# Save to public/
output_path = 'public/figure4_radar.png'
plt.tight_layout()
plt.savefig(output_path, dpi=300, bbox_inches='tight')
print(f"✅ Saved radar chart to {output_path}")
plt.close()
