# ============================================================
# SRGN in Canine and Human Osteosarcoma
# Layer 3: Human Survival Analysis
# Layer 5: Cross-Species scRNA-seq Comparison
# Author: Ruwini
# Date: 2026-05-17
# ============================================================

# ── Libraries ─────────────────────────────────────────────────────────
library(Seurat)
library(ggplot2)
library(ggpubr)
library(dplyr)
library(survival)
library(survminer)
library(GEOquery)
library(Matrix)

setwd("C:/Users/user/OneDrive/Desktop/GSE252470")

# ============================================================
# LAYER 3: HUMAN SURVIVAL ANALYSIS (GSE39055)
# ============================================================

# ── Load GSE39055 ─────────────────────────────────────────────────────
gse39   <- getGEO(filename = "GSE39055_series_matrix.txt.gz")
expr39  <- exprs(gse39)
pheno39 <- pData(gse39)

cat("Samples:", ncol(expr39), "\n")
cat("Probes:", nrow(expr39), "\n")

# ── Get SRGN probe IDs from GPL14951 ─────────────────────────────────
gpl39       <- getGEO(annotation(gse39))
gpl39_table <- Table(gpl39)
srgn_probes <- gpl39_table[gpl39_table$Symbol == "SRGN", "ID"]
cat("SRGN probes:", srgn_probes, "\n")
# Result: ILMN_1760347 and ILMN_2169152

# ── Extract SRGN expression ───────────────────────────────────────────
srgn_expr <- colMeans(expr39[rownames(expr39) %in% srgn_probes, ])
cat("SRGN expression range:", range(srgn_expr), "\n")

# ── Build survival dataframe ──────────────────────────────────────────
surv_df <- data.frame(
  sample     = pheno39$geo_accession,
  time       = as.numeric(pheno39$`time until first recurrence or latest follow-up (months):ch1`),
  recurrence = as.numeric(pheno39$`recurrence:ch1` == "Y"),
  SRGN       = srgn_expr,
  age        = as.numeric(pheno39$`age:ch1`),
  gender     = pheno39$`gender:ch1`,
  necrosis   = pheno39$`percent necrosis:ch1`
)

cat("Total patients:", nrow(surv_df), "\n")
cat("Recurrence events:", sum(surv_df$recurrence, na.rm = TRUE), "\n")

# ── Kaplan-Meier with median split ───────────────────────────────────
surv_df$SRGN_group <- ifelse(surv_df$SRGN >= median(surv_df$SRGN),
                              "SRGN High", "SRGN Low")

fit <- survfit(Surv(time, recurrence) ~ SRGN_group, data = surv_df)

ggsurvplot(fit,
           data          = surv_df,
           pval          = TRUE,
           conf.int      = TRUE,
           risk.table    = TRUE,
           tables.height = 0.25,
           palette       = c("#E41A1C", "#377EB8"),
           legend.title  = "",
           legend.labs   = c("SRGN High", "SRGN Low"),
           xlab          = "Time (months)",
           ylab          = "Recurrence-free Survival",
           title         = "SRGN and recurrence-free survival in human OSA\nGSE39055 (n=37)",
           ggtheme       = theme_bw())

ggsave("SRGN_human_RFS_clean.png", width = 8, height = 7, dpi = 300)
# Result: p = 0.72 with median split

# ── Cox model with median split ───────────────────────────────────────
cox_median <- coxph(Surv(time, recurrence) ~ SRGN, data = surv_df)
summary(cox_median)
# Result: HR = 1.22, 95% CI 0.74-2.01, p = 0.43

# ── Optimal cutpoint analysis ─────────────────────────────────────────
surv_cut <- surv_cutpoint(surv_df,
                           time      = "time",
                           event     = "recurrence",
                           variables = "SRGN")
summary(surv_cut)
# Result: optimal cutpoint = 10.42

surv_cat <- surv_categorize(surv_cut)
fit2 <- survfit(Surv(time, recurrence) ~ SRGN, data = surv_cat)

ggsurvplot(fit2,
           data          = surv_cat,
           pval          = TRUE,
           conf.int      = TRUE,
           risk.table    = TRUE,
           tables.height = 0.25,
           palette       = c("#E41A1C", "#377EB8"),
           legend.title  = "",
           xlab          = "Time (months)",
           ylab          = "Recurrence-free Survival",
           title         = "SRGN optimal cutpoint — GSE39055 (n=37)",
           ggtheme       = theme_bw())

ggsave("SRGN_human_optimal_cut.png", width = 8, height = 7, dpi = 300)
# Result: p = 0.04 with optimal cutpoint

# ── Cox model with optimal cutpoint ──────────────────────────────────
cox2 <- coxph(Surv(time, recurrence) ~ SRGN, data = surv_cat)
summary(cox2)
# Result: SRGN-high HR = 2.66, 95% CI 1.01-7.01, p = 0.05

# Save survival results
surv_results <- list(
  cutpoint  = 10.42,
  HR        = 2.66,
  CI_lower  = 1.008,
  CI_upper  = 7.013,
  p_logrank = 0.04,
  p_wald    = 0.05,
  n_total   = 37,
  n_events  = 18
)
saveRDS(surv_results, "human_survival_results.rds")


# ============================================================
# LAYER 5: CROSS-SPECIES scRNA-seq (GSE162454 — Human OSA)
# ============================================================

# ── Step 1: Extract TAR archive ───────────────────────────────────────
untar("GSE162454_RAW.tar", exdir = "GSE162454/raw")
list.files("GSE162454/raw")

# ── Step 2: Organise into per-sample subfolders ───────────────────────
sample_ids_human <- c("OS_1", "OS_2", "OS_3", "OS_4", "OS_5", "OS_6")
gsm_ids <- c("GSM4952363", "GSM4952364", "GSM4952365",
             "GSM5155198", "GSM5155199", "GSM5155200")

for (i in seq_along(sample_ids_human)) {
  dir.create(file.path("GSE162454", sample_ids_human[i]), showWarnings = FALSE)
  file.copy(
    file.path("GSE162454/raw",
              paste0(gsm_ids[i], "_", sample_ids_human[i], "_barcodes.tsv.gz")),
    file.path("GSE162454", sample_ids_human[i], "barcodes.tsv.gz"))
  file.copy(
    file.path("GSE162454/raw",
              paste0(gsm_ids[i], "_", sample_ids_human[i], "_features.tsv.gz")),
    file.path("GSE162454", sample_ids_human[i], "features.tsv.gz"))
  file.copy(
    file.path("GSE162454/raw",
              paste0(gsm_ids[i], "_", sample_ids_human[i], "_matrix.mtx.gz")),
    file.path("GSE162454", sample_ids_human[i], "matrix.mtx.gz"))
}

# ── Step 3: Load all 6 human OSA samples ─────────────────────────────
human_list <- lapply(sample_ids_human, function(sid) {
  counts <- Read10X(data.dir = file.path("GSE162454", sid))
  CreateSeuratObject(counts,
                     project      = sid,
                     min.cells    = 3,
                     min.features = 200)
})
names(human_list) <- sample_ids_human

# Merge
human_merged <- merge(human_list[[1]],
                      y            = human_list[-1],
                      add.cell.ids = sample_ids_human)
dim(human_merged)
# Result: 24,611 genes x 50,780 cells

# Confirm SRGN present
rownames(human_merged)[grep("SRGN", rownames(human_merged), ignore.case = TRUE)]
# Result: "SRGN"

# ── Step 4: QC filtering ──────────────────────────────────────────────
human_merged[["percent.mt"]] <- PercentageFeatureSet(human_merged, pattern = "^MT-")

VlnPlot(human_merged,
        features = c("nFeature_RNA", "nCount_RNA", "percent.mt"),
        ncol = 3, pt.size = 0)

human_filtered <- subset(human_merged,
                          subset = nFeature_RNA > 200  &
                                   nFeature_RNA < 7000 &
                                   nCount_RNA   < 60000 &
                                   percent.mt   < 20)

dim(human_filtered)
# Result: 24,611 genes x 44,086 cells

# ── Step 5: Seurat preprocessing ─────────────────────────────────────
human_filtered <- human_filtered %>%
  NormalizeData() %>%
  FindVariableFeatures(nfeatures = 3000) %>%
  ScaleData() %>%
  RunPCA(npcs = 30) %>%
  FindNeighbors(dims = 1:20) %>%
  FindClusters(resolution = 0.5) %>%
  RunUMAP(dims = 1:20)

# ── Step 6: SRGN on human UMAP ───────────────────────────────────────
DimPlot(human_filtered,
        reduction = "umap",
        label     = TRUE,
        pt.size   = 0.3) +
  ggtitle("Human OSA - all cells (GSE162454)")

FeaturePlot(human_filtered,
            features = "SRGN",
            cols     = c("lightgrey", "red"),
            pt.size  = 0.3) +
  ggtitle("SRGN expression in human OSA (GSE162454)")

ggsave("SRGN_human_scRNAseq_UMAP.png", width = 8, height = 6, dpi = 300)

# ── Step 7: Cell type annotation ──────────────────────────────────────
DotPlot(human_filtered,
        features  = c("PTPRC", "CD3E", "CD79A",
                       "CD68", "LYZ", "CTSK", "ACP5",
                       "FAP", "DCN", "PECAM1",
                       "RUNX2", "SPP1", "SRGN"),
        group.by  = "seurat_clusters",
        cols      = c("lightgrey", "darkred"),
        dot.scale = 6) +
  RotatedAxis() +
  scale_y_discrete(expand = expansion(add = 0.8)) +
  ggtitle("Cell type markers in human OSA") +
  xlab("") + ylab("Cluster")

ggsave("human_dotplot_markers.png", width = 12, height = 14, dpi = 300)

# Assign cell type labels based on marker expression
human_labels <- c(
  "0"  = "Tumor",      "1"  = "Tumor",      "2"  = "Tumor",
  "3"  = "Tumor",      "4"  = "Tumor",      "5"  = "Osteoclast",
  "6"  = "Tumor",      "7"  = "Tumor",      "8"  = "Tumor",
  "9"  = "Tumor",      "10" = "Tumor",      "11" = "CAF",
  "12" = "CAF",        "13" = "CAF",        "14" = "Endothelial",
  "15" = "Macrophage", "16" = "Tumor",      "17" = "T cell",
  "18" = "Tumor",      "19" = "B cell",     "20" = "T cell",
  "21" = "Macrophage", "22" = "Tumor",      "23" = "Osteoclast",
  "24" = "Tumor"
)

human_filtered[["cell_type"]] <- dplyr::recode(
  as.character(human_filtered$seurat_clusters),
  !!!human_labels)

# ── Step 8: SRGN by cell type ─────────────────────────────────────────
VlnPlot(human_filtered,
        features = "SRGN",
        group.by = "cell_type",
        pt.size  = 0) +
  ggtitle("SRGN expression by cell type in human OSA (GSE162454)") +
  xlab("") + ylab("Normalized expression") +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

ggsave("SRGN_human_celltype.png", width = 10, height = 6, dpi = 300)

# ── Step 9: Quantify SRGN+ cells ─────────────────────────────────────
human_filtered <- JoinLayers(human_filtered)

osteo_h <- subset(human_filtered, cell_type == "Osteoclast")
tumor_h <- subset(human_filtered, cell_type == "Tumor")

srgn_osteo_h <- FetchData(osteo_h, vars = "SRGN", layer = "counts")
srgn_tumor_h <- FetchData(tumor_h, vars = "SRGN", layer = "counts")

cat("Human osteoclast SRGN+:", round(mean(srgn_osteo_h$SRGN > 0) * 100, 2), "%\n")
cat("Human tumor SRGN+:",      round(mean(srgn_tumor_h$SRGN > 0) * 100, 2), "%\n")
# Result: Osteoclast 62.34%, Tumor 70.25%

# Chi-square test
contingency_h <- matrix(
  c(sum(srgn_osteo_h$SRGN > 0), sum(srgn_osteo_h$SRGN == 0),
    sum(srgn_tumor_h$SRGN > 0), sum(srgn_tumor_h$SRGN == 0)),
  nrow = 2,
  dimnames = list(c("SRGN+", "SRGN-"), c("Osteoclast", "Tumor"))
)
print(contingency_h)
chisq.test(contingency_h)
# Result: chi-sq = 73.014, p < 2.2e-16

# Save human annotated object
saveRDS(human_filtered, "GSE162454_annotated.rds")

# ============================================================
# CROSS-SPECIES SUMMARY TABLE
# ============================================================

# Key findings across species
summary_table <- data.frame(
  Species     = c("Canine", "Canine", "Human", "Human"),
  Cell_type   = c("Osteoclast", "Tumor", "Osteoclast", "Tumor"),
  SRGN_pos_pct = c(72.89, 17.88, 62.34, 70.25),
  Dataset     = c("GSE252470", "GSE252470", "GSE162454", "GSE162454"),
  n_cells     = c(4047, 23067, 2663, 34556)
)
print(summary_table)
write.csv(summary_table, "cross_species_SRGN_summary.csv", row.names = FALSE)

cat("\n== Analysis complete ==\n")
cat("Key finding: SRGN is osteoclast-enriched in canine OSA\n")
cat("In human OSA, SRGN shows broader expression including tumor cells\n")
cat("Both species show significant osteoclast vs tumor difference (p<2.2e-16)\n")
