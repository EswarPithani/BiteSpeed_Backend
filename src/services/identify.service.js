import prisma from "../db.js";

const process = async ({ email, phoneNumber }) => {
    // Find all contacts matching email or phoneNumber
    const existing = await prisma.contact.findMany({
        where: {
            OR: [
                { email: email || undefined },
                { phoneNumber: phoneNumber || undefined }
            ]
        }
    });

    // No matching contacts → create a new primary contact
    if (existing.length === 0) {
        const newContact = await prisma.contact.create({
            data: {
                email,
                phoneNumber,
                linkPrecedence: "primary"
            }
        });

        return {
            primaryContactId: newContact.id,
            emails: [newContact.email].filter(Boolean),
            phoneNumbers: [newContact.phoneNumber].filter(Boolean),
            secondaryContactIds: []
        };
    }

    // Contacts exist → find the primary (oldest createdAt)
    let primary = existing.find(c => c.linkPrecedence === "primary");

    if (!primary) {
        primary = existing.reduce((oldest, c) =>
            oldest.createdAt < c.createdAt ? oldest : c
        );
    }

    // Add new secondary if this request has new info
    const emailExists = existing.some(c => c.email === email);
    const phoneExists = existing.some(c => c.phoneNumber === phoneNumber);

    if (!emailExists || !phoneExists) {
        await prisma.contact.create({
            data: {
                email,
                phoneNumber,
                linkedId: primary.id,
                linkPrecedence: "secondary"
            }
        });
    }

    // Fetch all contacts linked to primary
    const all = await prisma.contact.findMany({
        where: {
            OR: [
                { id: primary.id },
                { linkedId: primary.id }
            ]
        }
    });

    return {
        primaryContactId: primary.id,
        emails: [...new Set(all.map(c => c.email).filter(Boolean))],
        phoneNumbers: [...new Set(all.map(c => c.phoneNumber).filter(Boolean))],
        secondaryContactIds: all
            .filter(c => c.linkPrecedence === "secondary")
            .map(c => c.id)
    };
};

export default { process };