from . import pathogenic_functions as pathogenic
from . import benign_functions as benign
from . import constants 
#import pymongo
from enum import Enum

class VariantClassifier:
	"""
	"""
	def __init__(self, *args, **kwargs):
		self.vcf_rows = None
		self.ped_rows = None

		self.kwargs = kwargs


	def set_kwargs(self, **kwargs):
		for k, v in kwargs.items():
			self.kwargs[k] = v 

	def get_vcf_rows(self):
		return self.vcf_rows

	def classify(self):
		with pymongo.MongoClient(host=constants.MONGO_HOST) as client:
			self.kwargs["mongo_client"] = client
			for row in self.kwargs['vcf_rows']:
				classification = {
					'Pathogenic': False,
					'Likely pathogenic': False,
					'Benign': False,
					'Likely benign': False,
					'Uncertain significance': False
				}

				result = {}
				for category in pathogenic.CATEGORY_TO_FUNCTION.keys():
					result[category] = pathogenic.CATEGORY_TO_FUNCTION[category](row, **self.kwargs)
					row[category] = result[category]

				for category in benign.CATEGORY_TO_FUNCTION.keys():
					result[category] = benign.CATEGORY_TO_FUNCTION[category](row, **self.kwargs)
					row[category] = result[category]

				confirmed_parent = True
				if confirmed_parent:
					if result['PS2']:
						row['PM6'] = False
						result['PM6'] = False
				else:
					if result['PM6']:
						row['PS2'] = False
						result['PS2'] = False	

				PVS = result['PVS1']
				PS = [
						result['PS1'],
						result['PS2'],
						result['PS3'],
						result['PS4']
					]

				PM = [
						result['PM1'],
						result['PM2'],
						result['PM3'],
						result['PM4'],
						result['PM5'],
						result['PM6']
					]

				PP = [
						result['PP1'],
						result['PP2'],
						result['PP3'],
						result['PP4'],
						result['PP5']
					]

				BA = result['BA1']
				BS = [
						result['BS1'],
						result['BS2'],
						result['BS3'],
						result['BS4']
					]

				BP = [
						result['BP1'],
						result['BP2'],
						result['BP3'],
						result['BP4'],
						result['BP6'],
						result['BP7']
					]

				pathogenic_i = PVS
				pathogenic_ia = sum(PS) >= 1
				pathogenic_ib = sum(PM) >= 2
				pathogenic_ic = (sum(PM) == 1) and (sum(PP) == 1)
				pathogenic_id = sum(PP) >= 2

				pathogenic_ii = sum(PS) >= 2

				pathogenic_iii = any(PS)

				pathogenic_iiia = sum(PM) >= 3
				pathogenic_iiib = (sum(PM) == 2) and (sum(PP) >= 2)
				pathogenic_iiic = (sum(PM) == 1) and (sum(PP) >= 4)

				is_pathogenic_i = pathogenic_i and any([
						pathogenic_ia, 
						pathogenic_ib, 
						pathogenic_ic,
						pathogenic_id
					])

				is_pathogenic_ii = pathogenic_ii

				is_pathogenic_iii = pathogenic_iii and any([
						pathogenic_iiia,
						pathogenic_iiib,
						pathogenic_iiic
					])

				classification['Pathogenic'] = any([
						is_pathogenic_i, 
						is_pathogenic_ii,
						is_pathogenic_iii
					])

				likely_pathogenic_i = PVS and (sum(PM) == 1)
				likely_pathogenic_ii = (sum(PS) == 1) and (sum(PM) in [1,2])
				likely_pathogenic_iii = (sum(PS) == 1) and (sum(PP) >= 2)
				likely_pathogenic_iv = sum(PM) >= 3
				likely_pathogenic_v = (sum(PM) == 2) and (sum(PP) >= 2)
				likely_pathogenic_vi = (sum(PM) == 1) and (sum(PP) >= 4) 

				classification['Likely pathogenic'] = any([
						likely_pathogenic_i,
						likely_pathogenic_ii,
						likely_pathogenic_iii,
						likely_pathogenic_iv,
						likely_pathogenic_v,
						likely_pathogenic_vi
					])

				benign_i = BA
				benign_ii = sum(BS) >= 2

				classification['Benign'] = any([
						benign_i,
						benign_ii
					])

				likely_benign_i = (sum(BS) == 1) and (sum(BP) == 1)
				likely_benign_ii = sum(BP) >= 2

				classification['Likely Benign'] = any([
						likely_benign_i,
						likely_benign_ii
					])


				uncertain_significance_i = not any([
						classification['Pathogenic'],
						classification['Likely pathogenic'],
						classification['Benign'],
						classification['Likely Benign'] 
					])

				uncertain_significance_ii = any([
						classification['Pathogenic'],
						classification['Likely pathogenic']
					]) and any([
						classification['Benign'],
						classification['Likely Benign'] 
					])

				classification['Uncertain significance'] = any([
						uncertain_significance_i, 
						uncertain_significance_ii
					])

				row['vip_classification'] = [k for k, v in classification.items() if v][0]
			
		return self.kwargs['vcf_rows']
