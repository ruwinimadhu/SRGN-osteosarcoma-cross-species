# SRGN-osteosarcoma-cross-species
Cross-species transcriptomic analysis of SRGN expression in canine and human osteosarcoma using scRNA-seq, bulk RNA-seq, and TF regulon analysis

SRGN Expression in Canine Osteosarcoma: A Cross-Species Transcriptomic Analysis
Overview
This repository contains the complete R analysis pipeline for investigating the role of SRGN (Serglycin) in canine osteosarcoma (OSA) using a four-layer computational approach. The study leverages canine scRNA-seq and bulk RNA-seq data to characterise SRGN's cell-type specificity and upstream transcriptional regulators, with cross-species validation in human OSA datasets.
---
Key Findings
SRGN is expressed in 72.89% of osteoclasts vs 17.88% of tumor cells in canine OSA (χ²=5399.9, p<2.2×10⁻¹⁶)
SRGN correlates with osteoclast markers CTSK (R=0.22, p=0.0019) and CD68 (R=0.23, p=0.0013) across 198 dogs
SRGN expression does not predict survival — indicating a mechanistic rather than prognostic role
TF regulon analysis identifies FOSL2, CEBPA and STAT5B as upstream regulators of SRGN in osteoclasts (FDR<10⁻¹³⁰)
---
Study Design
```
Layer 1: scRNA-seq       GSE252470 (6 dogs, 47,078 cells)
         ↓
         SRGN cell-type expression → osteoclast enrichment

Layer 2: Bulk RNA-seq    GSE238110 / DOG2 cohort (198 dogs)
         ↓
         SRGN correlation with osteoclast markers

Layer 3: Survival        DOG2 clinical (97 dogs) + GSE39055 human OSA (37 patients)
         ↓
         SRGN and clinical outcomes (OS, recurrence)

Layer 4: TF regulons     DoRothEA/VIPER on osteoclast subset
         ↓
         Upstream TF identification in SRGN-high osteoclasts
```
---
Repository Structure
```
SRGN-canine-OSA/
├── SRGN_canine_OSA_analysis.Rmd   # Main analysis R Markdown
├── README.md                       # This file
├── figures/
│   ├── umap_celltypes.png          # UMAP with annotated cell types
│   ├── dotplot_markers_final.png   # Cell type marker DotPlot
│   ├── SRGN_by_celltype.png        # SRGN VlnPlot by cell type
│   ├── SRGN_osteoclast_correlation_panel.png  # Bulk correlation panel
│   ├── SRGN_survival_KM.png        # Canine KM curve
│   ├── SRGN_human_recurrence_KM.png # Human KM curve
│   └── TF_activity_volcano.png     # TF regulon volcano plot
```
---
Data Sources
Dataset	Description	Access
GSE252470	Canine OSA single-cell RNA-seq atlas (6 dogs)	GEO
GSE238110	DOG2 canine OSA bulk RNA-seq (198 dogs)	GEO
COTC022 SOC	Canine clinical trial survival data	ICDC
GSE39055	Human OSA microarray with recurrence data	GEO
---
Requirements
R packages
```r
# CRAN
install.packages(c("Seurat", "ggplot2", "ggpubr", "dplyr",
                   "survival", "survminer", "readxl", "readr",
                   "Matrix", "ggrepel"))

# Bioconductor
BiocManager::install(c("dorothea", "viper", "GEOquery"))
```
R version
Developed and tested on R 4.5.1
---
Usage
Clone this repository
Download the required datasets from GEO (links above)
Organise files as described in the Rmd
Open `SRGN_canine_OSA_analysis.Rmd` in RStudio
Update `setwd()` to your local path
Run all chunks sequentially
To render to GitHub Markdown:
```r
rmarkdown::render("SRGN_canine_OSA_analysis.Rmd")
```
---
Figures
UMAP — Annotated Cell Types
![UMAP cell types](figures/umap_celltypes.png)
SRGN Expression by Cell Type
![SRGN violin plot](figures/SRGN_by_celltype.png)
Bulk Correlation with Osteoclast Markers
![Correlation panel](figures/SRGN_osteoclast_correlation_panel.png)
TF Regulon Volcano Plot
![TF volcano](figures/TF_activity_volcano.png)
---
Citation
If you use this code or analysis, please cite:
> [Your name(s)], [Year]. SRGN defines an osteoclast-enriched stromal compartment
> in canine osteosarcoma regulated by FOSL2, CEBPA and STAT5B.
> [Journal]. [DOI when available]
---
License
MIT License — free to use and adapt with attribution.
---
Contact
For questions about this analysis please open a GitHub issue.
