from . import constants 
import re


def PVS1(vcf_row, **kwargs):
    """
    Pathogenicity PVS1 (very strong) definition.

    Args:
        vcf_row (dict): Maps column names to values for a specific row in the 
                        given vcf_file.
    
    Returns:
        int: 1 if pathogenicity is established, 0 if established to be 
            non-pathogenic or inconclusive.
    """
    # determine result_1
    result_1 = 0

    # TODO when result_1 becomes 1 we can stop going through the rest of the considerations
    if 'effect' in vcf_row:
        # determine nonsense
        if 'stopgain' in vcf_row['effect']:
            result_1 = 1

        # determine frameshift
        frameshifts = [
                'frameshift insertion',
                'frameshift deletion',
                'frameshift substitution'
        ]

        if all(frameshift in vcf_row['effect'] for frameshift in frameshifts):
            if 'nonframeshift' not in vcf_row['effect']:
                result_1 = 1

    if 'typeseq' in vcf_row:
        # determine canonical splice site
        splicing = [
                'splicing',
                'ncRNA_splicing'
        ]
        score_columns = [
                vcf_row['dbscSNV_ADA_SCORE'],
                vcf_row['dbscSNV_RF_SCORE']
        ]
        if any([splice in vcf_row['typeseq'] for splice in splicing]):
            if any([float(score) > 0.6 for score in score_columns if score != 'NA']):
                result_1 = 1

    # determine initiation codon
    if 'refseq_id' in vcf_row:
        if 'p.Met1' in vcf_row['refseq_id']:
            result_1 = 1

    # determine single or multiexon deletion

    if 'refseq_id' in vcf_row:
        if re.search(r'c\.\([0-9]+\+1_[0-9]+\-1\)_\([0-9]+\+1_[0-9]+\-1\)del', vcf_row['refseq_id']):
            print(vcf_row['refseq_id'])            
            result_1 = 1
        if re.search(r'c\.[0-9]+(_[0-9]+)?del', vcf_row['refseq_id']):
            result_1 = 1
        # if re.search(r'c\.\(')

        

    # define result_2
    result_2 = 0
    client = kwargs.get('mongo_client', None)
    db = client[constants.DB_NAME]
    coll = db[constants.P_DICT['PVS1']]

    document = coll.find_one({
            'name': vcf_row['gene_symbol']
        })
    if document is not None:
        result_2 = 1


    result = all([result_1, result_2])
    return result


def PS1(vcf_row, **kwargs):
    """
    Pathogenicity PS1 (strong) definition.

    Args:
        vcf_row (dict): Maps column names to values for a specific row in the 
                        given vcf_file.
    
    Returns:
        int: 1 if pathogenicity is established, 0 if established to be 
            non-pathogenic or inconclusive.
    """
    # determine results_1
    result_1 = 0

    is_nonsynonymous = vcf_row['effect'] == 'nonsynonymous SNV'

    if 'typeseq' in vcf_row:
        if vcf_row['typeseq'] == 'exonic' and is_nonsynonymous:
            result_1 = 1

    
    # determine results_2
    result_2 = 0
    
    if 'refseq_id' in vcf_row and is_nonsynonymous:
        protein_fields = set()
        refseq_list = vcf_row['refseq_id'].split(',')
        for refseq in refseq_list:
            refseq_info_list = refseq.split(':') 

            for refseq_info in refseq_info_list:
                if refseq_info.startswith('p.'):
                    protein_fields.add(refseq_info[2:])

        # regex p\.([A-Z0-9]+) for typeseq search to find all matches
        # protein_fields = set(re.findall(r'p\.([a-zA-Z0-9]+)', )


        # check that the regex search yielded results
        if protein_fields:
            for p_field in protein_fields:

                clinvar_protein = None

                del_match = re.match(r'[0-9]+_[0-9]+del', p_field)
                nonsyn_snv_match = re.match(r'([a-zA-Z]+)([0-9]+)([a-zA-Z]+)', p_field)
                # if variant is a deletion, no aa conversion is needed
                if del_match:
                    clinvar_protein = del_match[0]

                elif nonsyn_snv_match:

                    start_aa = nonsyn_snv_match[1]
                    loc = nonsyn_snv_match[2]
                    end_aa = nonsyn_snv_match[3]
                    clinvar_protein = "{}{}{}".format(constants.AA_DICT[start_aa], loc, constants.AA_DICT[end_aa])

                if clinvar_protein:
                    client =  kwargs.get('mongo_client', None)
                    db = client[constants.DB_NAME]
                    coll = db[constants.P_DICT['PS1']]

                    # find the documents with the same gene
                    document = coll.find_one({
                            'GeneSymbol': vcf_row['gene_symbol'],
                            'AA_Change': {'$regex': "^"+clinvar_protein}
                        })

                    if document is not None:
                        result_2 = 1
            # TODO query mongo dictionary to match our proteins for the same gene


    result = all([result_1, result_2])
    return result


def PS2(vcf_row, **kwargs):
    """
    Pathogenicity PS2 (strong) defintion.

    Args:
        vcf_row (dict): Maps column names to values for a specific row in the 
                        given vcf_file.
        ped (list[dict]): list containing a dictionary for each row of the .ped 
                        file
    
    Returns:
        int: 1 if pathogenicity is established, 0 if established to be 
            non-pathogenic or inconclusive.
    """
    result = 0
    ped = kwargs.get('ped_rows', None)

    if ped is not None:
        result_proband = 0
        result_parents = 0
        
        fam_samples = {}

        for key, value in vcf_row.items():
            # collect all unique sample id's from the headers of the vcf row
            if re.match(r'X([0-9]+)\.Zygosity', key):
                sample_id = re.match(r'X([0-9]+)\.', key)[1]
                sample_zygosity = value
                fam_samples[sample_id] = sample_zygosity

    
        # for each unique sample id find whether proband or parent and check for 
        #   zygosity accordingly
        for row in ped:
            if row['sample_id'] in fam_samples.keys():
                # if the zygosity of both the parents are not evaluated, result = 0
                if int(row['paternity']) != 0 and int(row['maternity']) != 0:
                    # process this row as the proband
                    if fam_samples[row['sample_id']] == 'ref-alt':
                        result_proband = 1

                    # determine the parents
                    father_zygo = fam_samples[row['paternity']]
                    mother_zygo = fam_samples[row['maternity']]

                    if all('hom-ref' in parent for parent in [father_zygo, mother_zygo]):
                        result_parents = 1
       
        result = all([result_proband, result_parents])

    return result


def PS3(vcf_row, **kwargs):
    """ Pathogenicity PS3 (strong) defintion. """
    result = 0
    return result


def PS4(vcf_row, **kwargs):
    """
    Pathogenicity PS4 (strong) defintion.

    Args:
        vcf_row (dict): Maps column names to values for a specific row in the 
                        given vcf_file.
        phenotype (list[str]): user specified phenotypes
        or_threshold (int): threshold for filtering the GWAS catalogue 
                            by odds ratio.
        p_value (float): threshold to filter the SNP p-value
    
    Returns:
        int: 1 if pathogenicity is established, 0 if established to be 
            non-pathogenic or inconclusive.
    """

    phenotypes = kwargs.get('phenotypes', None)
    p_value = kwargs.get('p_value', 0.05)
    or_threshold = kwargs.get('or_threshold', None)

    result = 0

    client =  kwargs.get('mongo_client', None)
    db = client[constants.DB_NAME]
    coll = db[constants.P_DICT['PS4']]

    if vcf_row['dbsnp'] != "NA":
        if phenotypes is not None:
            document = coll.find_one({
                    'SNP_ID_CURRENT': {'$regex' : vcf_row['dbsnp'].replace("rs", "^")},
                    'P-VALUE': {'$lt': p_value},
                    'DISEASE/TRAIT': {'$in': phenotypes}
                })
        else:
            document = coll.find_one({
                    'SNP_ID_CURRENT': {'$regex' : vcf_row['dbsnp'].replace("rs", "^")},
                    'P-VALUE': {'$lt': p_value}
                })
        if document is not None:
            result_2 = 1
    
    return result


def PM1(vcf_row, **kwargs):
    """
    Pathogenicity PM1 (moderate) defintion.

    Args:
        vcf_row (dict): Maps column names to values for a specific row in the 
                        given vcf_file.
    
    Returns:
        int: 1 if pathogenicity is established, 0 if established to be 
            non-pathogenic or inconclusive.
    """
    result_1 = 0
    result_2 = 0

    # establish result_1
    unwanted_effects = [
            'synonymous SNV',
            'NA',
            'unknown'
    ]
    
    result_1_1 = 0
    result_1_2 = 0

    if all(x != vcf_row['effect'] for x in unwanted_effects):
        result_1_1 = 1
    if 'exonic' in vcf_row['typeseq']:
        result_1_2 = 1

    result_1 = all([result_1_1, result_1_2])

    # establish result_2
    result_2 = 0
    protein_fam = vcf_row['pfam_annovar']
    if protein_fam and protein_fam != 'NA':

        pfam_list = protein_fam.split(',')

        for pfam in pfam_list:
            client =  kwargs.get('mongo_client', None)
            db = client[constants.DB_NAME]
            coll = db[constants.P_DICT['PM1']]

            document = coll.find_one({
                    'Pfam ID': {'$regex' : pfam}
                })
            if document is not None:
                result_2 = 1
        
    result = all([result_1, result_2])
    return result


def PM2(vcf_row, **kwargs):
    """ Pathogenicity PM2 (moderate) defintion. """
    # TODO waiting for comments from Roozbeh

    result = 0
    af_cutoff = kwargs.get("af_cutoff", constants.AF_CUTOFF)

    for allele_header in constants.VCF_ALLELE_FREQ_HEADERS:
        if float(vcf_row[allele_header]) < af_cutoff:
            result = 1
            break

    return result


def PM3(vcf_row, **kwargs):
    """ Pathogenicity PM3 (moderate) defintion. """
    result = 0
    return result


def PM4(vcf_row, **kwargs):
    """
    Pathogenicity PM4 (moderate) defintion.

    Args:
        vcf_row (dict): Maps column names to values for a specific row in the 
                        given vcf_file.
    
    Returns:
        int: 1 if pathogenicity is established, 0 if established to be 
            non-pathogenic or inconclusive.
    """
    result_1 = 0
    result_2 = 0

    # determine nonframeshifts
    changes = [
            'nonframeshift insertion',
            'nonframeshift deletion',
            'stoploss'
    ]

    if any([change in vcf_row['effect'] for change in changes]):
        result_1 = 1

    if 'NA' in vcf_row['Repeat']:
        result_2 = 1

    result = all([result_1, result_2])
    return result


def PM5(vcf_row, **kwargs):
    """
    Pathogenicity PM4 (moderate) defintion.

    Args:
        vcf_row (dict): Maps column names to values for a specific row in the 
                        given vcf_file.
    
    Returns:
        int: 1 if pathogenicity is established, 0 if established to be 
            non-pathogenic or inconclusive.
    """
    result_1 = 0

    # determine result_1
    result_1_1 = 0
    result_1_2 = 0

    if all(x in vcf_row['typeseq'] for x in ['exonic', 'splicing']):
        result_1_1 = 1

    if 'nonsynonymous' in vcf_row['effect']:
        result_1_2 = 1
    
    result_1 = all([result_1_1, result_1_2])
    
    # determine result_2
    if 'refseq_id' in vcf_row:
        # regex p\.([A-Z0-9]+) for refseq search to find all matches
        proteins = re.findall(r'p\.([A-Z0-9]+)', vcf_row['refseq_id'])
        #TODO compare this with the dictionary used in PS1 to compare genes

    result = all([result_1, result_1])

    return result


def PM6(vcf_row, **kwargs):
    """
    Pathogenicity PM6 (moderate) defintion.

    Args:
        vcf_row (dict): Maps column names to values for a specific row in the 
                        given vcf_file.
        ped (list[dict]): list containing a dictionary for each row of the .ped 
                        file
    
    Returns:
        int: 1 if pathogenicity is established, 0 if established to be 
            non-pathogenic or inconclusive.
    """
    ped = kwargs.get('ped_rows', None)
    result = 0
    if ped is not None:
        result_proband = 0
        result_parents = 0
        
        fam_samples = {}

        for key, value in vcf_row.items():
            # collect all unique sample id's from the headers of the vcf row
            if re.match(r'X([0-9]+)\.Zygosity', key):
                sample_id = re.match(r'X([0-9]+)\.', key)[1]
                sample_zygosity = value
                fam_samples[sample_id] = sample_zygosity

        # for each unique sample id find whether proband or parent and check for 
        #   zygosity accordingly
        for row in ped:
            if row['sample_id'] in fam_samples.keys():
                # if the zygosity of both the parents are not evaluated, result = 0
                if int(row['paternity']) != 0 and int(row['maternity']) != 0:
                    # process this row as the proband
                    if fam_samples[row['sample_id']] == 'ref-alt':
                        result_proband = 1

                    # determine the parents
                    father_zygo = fam_samples[row['paternity']]
                    mother_zygo = fam_samples[row['maternity']]

                    if all('hom-ref' in parent for parent in [father_zygo, mother_zygo]):
                        result_parents = 1
       
        result = all([result_proband, result_parents])
    return result



def PP1(vcf_row, **kwargs):
    """ Pathogenicity PP1 (supporting) defintion. """
    result = 0
    return result


def PP2(vcf_row, **kwargs):
    """
    Pathogenicity PP2 defintion.

    Args:
        vcf_row (dict): Maps column names to values for a specific row in the 
                        given vcf_file.
    
    Returns:
        int: 1 if pathogenicity is established, 0 if established to be 
            non-pathogenic or inconclusive.
    """
    result = 0
   
    exac = 'Exac_mis_z'

    # check that the columns exists
    if all(x in vcf_row for x in ['effect', exac]):
        if vcf_row[exac] != 'NA':
            if 'nonsyn' in vcf_row['effect'] and float(vcf_row[exac]) >= 3.06:
                result = 1

    return result


def PP3(vcf_row, **kwargs):
    """ Pathogenicity PP3 (supporting) defintion. """

    result = 0

    row_categories = []
    category_average_cutoff = kwargs.get('category_average_cutoff', 1)
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



def PP4(vcf_row, **kwargs):
    """ Pathogenicity PP4 (supporting) defintion. """
    result = 0
    return result


def PP5(vcf_row, **kwargs):
    """
    Pathogenicity PP5 (supporting) defintion.

    Args:
        vcf_row (dict): Maps column names to values for a specific row in the 
                        given vcf_file.
    
    Returns:
        int: 1 if pathogenicity is established, 0 if established to be 
            non-pathogenic or inconclusive.
    """
    result_1 = 0
    result_2 = 0

    seq = 'Clinvar_seq'
    review = 'Clinvar_ReviewStatus'

    # check if the columns we need exist
    if all(x in vcf_row for x in [seq, review]):
        if vcf_row[seq] == 'pathogenic':
            result_1 = 1
        if all(x in vcf_row[review] for x in ['multiple submitters', 'no conlficts']):
            result_2 = 1

    result = all([result_1, result_2])
    return result


CATEGORY_TO_FUNCTION = {
    'PVS1':  PVS1,
    'PS1': PS1,
    'PS2': PS2,
    'PS3': PS3,
    'PS4': PS4,
    'PM1': PM1,
    'PM2': PM2,
    'PM3': PM3,
    'PM4': PM4,
    'PM5': PM5,
    'PM6': PM6,
    'PP1': PP1,
    'PP2': PP2,
    'PP3': PP3,
    'PP4': PP4,
    'PP5': PP5
}
