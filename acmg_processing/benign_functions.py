from . import constants

def BA1(vcf_row, **kwargs):

	result = 0
	max_frequency = None	
	frequency_threshold = kwargs.get('frequency_threshold', 0.05)
	#: for each frequency allele header
	for allele_header in constants.VCF_ALLELE_FREQ_HEADERS:
		#: if this row has a value for the header
		if allele_header in vcf_row:

			#: if there is no frequency value yet, or this column's value is greater than the highest value
			if (max_frequency is None) or float(vcf_row[allele_header]) > max_frequency:
				max_frequency = float(vcf_row[allele_header])

	if max_frequency > frequency_threshold:
		result = 1

	return result

def BS1(vcf_row, **kwargs):
	result = 0
	min_frequency = None
	allele_freq_multiplier = kwargs.get('allele_freq_multiplier', 10)	
	#: for each frequency allele header
	for allele_header in constants.VCF_ALLELE_FREQ_HEADERS:
		#: if this row has a value for the header
		if allele_header in vcf_row:

			#: if there is no frequency value yet, or this column's value is less than the lowest value
			if (min_frequency is None) or float(vcf_row[allele_header]) < min_frequency:
				min_frequency = float(vcf_row[allele_header])

	#TODO: calculate expected_allele_frequency
	expected_allele_frequency = 0


	if min_frequency > allele_freq_multiplier * expected_allele_frequency:
		result = 1

	return result

def BS2(vcf_row, **kwargs):
	result = 0
	return result

def BS3(vcf_row, **kwargs):
	result = 0
	return result

def BS4(vcf_row, **kwargs):
	result = 0
	return result

def BP1(vcf_row, **kwargs):
	result = 0
	return result

def BP2(vcf_row, **kwargs):
	result = 0
	return result

def BP3(vcf_row, **kwargs):
	result = 0

	if (vcf_row['effect'].casefold() in ["nonframeshift insertion".casefold(), "nonframeshift deletion".casefold()]) and (vcf_row['Repeat'] != "NA"):
		result = 1

	return result

def BP4(vcf_row, **kwargs):
	result = 0

	row_categories = []
	category_average_cutoff = kwargs.get('category_average_cutoff', 0.5)
	#: for each possible score header
	for score_header in constants.SCORE_CATEGORY.keys():
		#: if there is a value for the score
		if vcf_row[score_header] != "NA":
			#: find its categorical none, soft, or hard score (0, 1, 2)
			row_score = float(vcf_row[score_header])
			row_category = constants.SCORE_CATEGORY[score_header](row_score)
			row_categories.append(row_category)


	if len(row_categories) > 0:
		average = sum(row_categories)/len(row_categories)
		
		if average < category_average_cutoff:
			result = 1

	return result

def BP6(vcf_row, **kwargs):
	result = 0
	
	result_t = []

	sigs     = [sig.casefold().strip()    for sig    in vcf_row['typeseq'].split(',')]
	statuses = [status.casefold().strip() for status in vcf_row['Clinvar_ReviewStatus'].split(',')]

	result_t.append('benign' in sigs)
	result_t.append('multiple submitters' in statuses)
	result_t.append('no conflicts' in statuses)

	if all(result_t):
		result = 1

	return result

def BP7(vcf_row, **kwargs):
	result = 0
	result_t1 = 0
	result_t2 = 0
	result_t3 = 0

	rf_cutoff = kwargs.get('rf_cutoff', 0.6)
	ada_cutoff = kwargs.get('ada_cutoff', 0.6)
	spx_dpsi_cutoff = kwargs.get('spx_dpsi_cutoff', -10)
	pmam_cutoff = kwargs.get('pmam_cutoff', 1)
	vert_cutoff = kwargs.get('vert_cutoff', 1.5)
	
	type_seqs = [type_seq.casefold() for type_seq in vcf_row['typeseq'].split(';')]
	effects =   [effect.casefold()   for effect   in vcf_row['effect'].split(';')]

	result_t1_t = []
	result_t1_t.append('exonic' in type_seqs)
	result_t1_t.append('splicing' not in type_seqs)
	result_t1_t.append('nonsynonymous snv' in effects)

	if all(result_t1_t):
		result_t1 = 1

	rf_score  = vcf_row['dbscSNV_RF_SCORE']
	ada_score = vcf_row['dbscSNV_ADA_SCORE']
	spx_dpsi  = vcf_row['spx_dpsi']

	result_t2_t = []
	result_t2_t.append(True if rf_score  == 'NA' else float(rf_score) < rf_cutoff)
	result_t2_t.append(True if ada_score == 'NA' else float(ada_score) < ada_cutoff)
	result_t2_t.append(True if spx_dpsi  == 'NA' else float(spx_dpsi)  > spx_dpsi_cutoff)

	if all(result_t2_t):
		result_t2 = 1

	pmam_avg    = vcf_row['phylopPMam_avg']
	vert100_avg = vcf_row['phylopVert100_avg']
	gerp_wgs          = vcf_row['gerp_wgs']

	result_t3_t = []
	result_t3_t.append(True if pmam_avg    == 'NA' else float(pmam_avg)    < pmam_cutoff)
	result_t3_t.append(True if vert100_avg == 'NA' else float(vert100_avg) < vert_cutoff)
	result_t3_t.append(True if gerp_wgs    == 'NA' else False)

	if all(result_t3_t):
		result_t3 = 1

	result = all([result_t1, result_t2, result_t3])

	return result

CATEGORY_TO_FUNCTION = {
	'BA1': BA1,
	'BS1': BS1,
	'BS2': BS2,
	'BS3': BS3,
	'BS4': BS4,
	'BP1': BP1,
	'BP2': BP2,
	'BP3': BP3,
	'BP4': BP4,
	'BP6': BP6,
	'BP7': BP7
}
