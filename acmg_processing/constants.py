#DB_NAME ="VIP"
#DB_GRIDFS = "databases"
#MONGO_HOST = 'localhost:27017'

DELIMITER= '\t'

##	DATABASES	##
# PVS1 (Loss of Function)
# Download link: "http://ftp.ncbi.nlm.nih.gov/pub/dbVar/clingen/ClinGen_haploinsufficiency_gene.bed"
CLINGEN_NAME = 'ClinGen'
CLINGEN_FILENAME = "ClinGen_haploinsufficiency_gene"
CLINGEN_HEADER = "chrom{0}chromStart{0}chromEnd{0}name{0}score\n#".format(DELIMITER)

# Download link: "https://decipher.sanger.ac.uk/files/downloads/HI_Predictions_Version3.bed.gz" 
DECIPHER_NAME = "Decipher"
DECIPHER_FILENAME = "HI_Predictions_Version3" 
DECIPHER_HEADER = "chrom{0}chromStart{0}chromEnd{0}name{0}score{0}strand{0}thickStart{0}thickEnd{0}itemRgb\n#".format(DELIMITER)

# Download link: "ftp://ftp.broadinstitute.org/pub/ExAC_release/release1/manuscript_data/forweb_cleaned_exac_r03_march16_z_data_pLI.txt.gz"
EXACPLI_NAME = "ExACPLI"
EXACPLI_FILENAME = "exac_r03_march16_z_data_pLI"

# PS1 (Established Pathogenicity)
# Download link: "ftp://ftp.ncbi.nlm.nih.gov/pub/clinvar/tab_delimited/variant_summary.txt.gz"
CLINVAR_NAME = 'ClinVar'
CLINVAR_FILENAME = "variant_summary"
CLINVAR_HEADER = "AlleleID{0}Type{0}Name{0}GeneID{0}GeneSymbol{0}HGNC_ID{0}ClinicalSignificance{0}ClinSigSimple{0}LastEvaluated{0}RS# (dbSNP){0}nsv/esv (dbVar){0}RCVaccession{0}PhenotypeIDS{0}PhenotypeList{0}Origin{0}OriginSimple{0}Assembly{0}ChromosomeAccession{0}Chromosome{0}Start{0}Stop{0}ReferenceAllele{0}AlternateAllele{0}Cytogenetic{0}ReviewStatus{0}NumberSubmitters{0}Guidelines{0}TestedInGTR{0}OtherIDs{0}SubmitterCategories{0}VariationID\n".format(DELIMITER)

# PS4 (Known Associated SNPs)
# Downlaod link: "https://www.ebi.ac.uk/gwas/api/search/downloads/full"
GWAS_NAME = 'GWAS'
GWAS_FILENAME = "full"

# PM1 (Domain Benign)
# Download link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5656839/bin/HUMU-38-1454-s003.xlsx"
DOMAINBENIGN_NAME = 'DomainBenign'
DOMAINBENIGN_FILENAME = "HUMU-38-1454-s003"

# Download link: "ftp://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.clans.tsv.gz"
PFAM_NAME = 'Pfam'
PFAM_FILENAME = "Pfam-A.clans"
PFAM_HEADER = "Pfam accession{0}clan accession{0}clan ID{0}Pfam ID{0}Pfam description\n".format(DELIMITER)


## PATHOGENICITY DICTIONARY ##
P_DICT = {
	"PVS1": "LossOfFunction",
	"PS1":  "EstablishedPathogenicity",
	"PS4":  "KnownAssociatedSNPs",
	"PM1":  "DomainBenign"
}


##	PATHOGENICITY	##

# BSA
VCF_ALLELE_FREQ_HEADERS = [
	"X1000g_all",
	"X1000g_eur",
	"X1000g_amr",
	"X1000g_eas",
	"X1000g_afr",
	"X1000g_sas",
	"ExAC_Freq",
	"ExAC_AFR",
	"ExAC_AMR",
	"ExAC_EAS",
	"ExAC_FIN",
	"ExAC_NFE",
	"ExAC_OTH",
	"ExAC_SAS",
	"gnomAD_exome_ALL",
	"gnomAD_exome_AFR",
	"gnomAD_exome_AMR",
	"gnomAD_exome_ASJ",
	"gnomAD_exome_EAS",
	"gnomAD_exome_FIN",
	"gnomAD_exome_NFE",
	"gnomAD_exome_OTH",
	"gnomAD_exome_SAS",
	"gnomAD_genome_ALL",
	"gnomAD_genome_AFR",
	"gnomAD_genome_AMR",
	"gnomAD_genome_ASJ",
	"gnomAD_genome_EAS",
	"gnomAD_genome_FIN",
	"gnomAD_genome_NFE",
	"gnomAD_genome_OTH"
]

AF_CUTOFF = 1e-5



def SCORE_MAP(isSoft: bool, isHard: bool) -> int:
	"""Returns a score based on soft and hard requirements"""
	if isHard:
		return 2
	elif isSoft:
		return 1
	else:
		return 0

# dictionary of functions that can be called from pathogenicity
# values can be changed based on expert opinion
SCORE_CATEGORY = {
	"sift_score": lambda score: SCORE_MAP(score < 0.05, score < 0.01),

	"PROVEAN_score": lambda score: SCORE_MAP(score < -2.5, score < -4.1),

	"polyphen_score": lambda score: SCORE_MAP(score > 0.15, score > 0.85),

	"ma_score": lambda score: SCORE_MAP(score >=1.9, False),

	"mt_score": lambda score: SCORE_MAP(score >=0.5, False),

	"CADD_phred": lambda score: SCORE_MAP(score > 10, score > 20),

	"phylopPMam_avg": lambda score: SCORE_MAP(score == 1, score == 2.5),

	"phylopVert100_avg": lambda score: SCORE_MAP(score == 1.5, score == 5),

	"phastCons_placental": lambda score: SCORE_MAP(True, score > 500 ),

}

AA_DICT = {	
	'A': 'Ala',	
	'B': 'Asx',	
	'C': 'Cys',
	'D': 'Asp',
	'E': 'Glu',
	'F': 'Phe',
	'G': 'Gly',	
	'H': 'His',
	'I': 'Ile',
	'K': 'Lys',
	'L': 'Leu',
	'M': 'Met',	
	'N': 'Asn',
	'P': 'Pro',	
	'Q': 'Gln',
	'R': 'Arg',	
	'S': 'Ser',	
	'T': 'Thr',	
	'U': 'Sec',
	'V': 'Val',	
	'W': 'Trp',
	'X': 'Xaa',	
	'Y': 'Tyr',
	'Z': 'Glx',
	'fs': 'fs'
}
