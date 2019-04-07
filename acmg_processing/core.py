from data_processing import DataProcessor
from .pathogenicity_processing import VariantClassifier
import csv

def classify_vcf(vcf_filename, ped_filename):
	"""
	Classifies the genes provided in the vcf file as pathogenic, likely pathogenic, bigning and likely benign following acmg guidelines.

	Args:
		vcf_filename (string): name of the vcf file uploaded by the user (containing a list of genes)
		ped_filename (string): name of the ped file provided by the user (containing family data)

	Returns:
		json: creates a json file mapping pathogenic genes to the acmg definitions that triggered the classification.
	"""
	with open(vcf_filename) as vcf_file:
		ped_rows = None
		try:
			with open(ped_filename) as ped_file:
				ped_rows = list(csv.DictReader(ped_file.read().splitlines(), delimiter = '\t'))
		except OSError as e:
			pass
		vcf_rows = list(csv.DictReader(vcf_file.read().splitlines(), delimiter = '\t'))
		classifier = VariantClassifier.VariantClassifier(vcf_rows = vcf_rows, ped_rows = ped_rows)
		rows = classifier.classify()
		non_vus = [row for row in rows if row['vip_classification'] != 'Uncertain significance']

		with open("classified_"+vcf_filename, 'w', newline='') as out_vcf:
			dict_writer = csv.DictWriter(out_vcf, fieldnames = rows[0].keys(), delimiter = '\t') 
			dict_writer.writeheader()
			dict_writer.writerows(rows)
